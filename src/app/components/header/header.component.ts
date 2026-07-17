import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavLinksComponent } from '../nav-links/nav-links.component';
import { SearchPanelComponent } from '../search-panel/search-panel.component';
import { NAV_ITEMS, NavLinkItem } from '../../models/nav.models';
import { DEFAULT_FILTERS, SearchFilters } from '../../models/search.models';

const MOBILE_MQ = '(max-width: 767px)';

@Component({
  selector: 'app-header',
  imports: [NavLinksComponent, SearchPanelComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly navItems: NavLinkItem[] = NAV_ITEMS;
  public readonly notificationCount: number = 32;

  public activeNavId: string = 'favorites';
  public isSearchOpen: boolean = false;
  public isSearchClosing: boolean = false;
  public isMobile: boolean = false;
  public searchQuery: string = '';
  public filters: SearchFilters = { ...DEFAULT_FILTERS };
  public history: string[] = [
    'закрепить теги',
    'кнопка',
    'приложение',
    'форма',
    'текстовое поле',
  ];

  private closeFallbackId: ReturnType<typeof setTimeout> | null = null;
  private mobileMq?: MediaQueryList;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get showSearchPanel(): boolean {
    return this.isSearchOpen || this.isSearchClosing;
  }

  ngOnInit(): void {
    this.mobileMq = window.matchMedia(MOBILE_MQ);
    this.syncMobile(this.mobileMq.matches);
    this.mobileMq.addEventListener('change', this.onMobileChange);
  }

  ngOnDestroy(): void {
    this.mobileMq?.removeEventListener('change', this.onMobileChange);
    this.clearCloseFallback();
  }

  openSearch(): void {
    this.clearCloseFallback();
    this.isSearchClosing = false;
    this.isSearchOpen = true;
  }

  closeSearch(): void {
    if (!this.isSearchOpen || this.isSearchClosing) {
      return;
    }

    this.isSearchOpen = false;
    this.isSearchClosing = true;
    this.clearCloseFallback();
    this.closeFallbackId = setTimeout(
      () => this.onSearchCloseAnimationDone(),
      280,
    );
  }

  onSearchCloseAnimationDone(): void {
    if (!this.isSearchClosing) {
      return;
    }

    this.clearCloseFallback();
    this.isSearchClosing = false;
    this.searchQuery = '';
  }

  onFiltersChange(filters: SearchFilters): void {
    this.filters = filters;
  }

  onHistorySelect(term: string): void {
    this.searchQuery = term;
  }

  onSubmitSearch(query: string): void {
    if (!query) {
      return;
    }

    if (!this.history.includes(query)) {
      this.history = [query, ...this.history].slice(0, 8);
    }

    console.log('Search:', { query, filters: this.filters });
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.isSearchOpen || this.isSearchClosing || this.isMobile) {
      return;
    }

    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.closeSearch();
    }
  }

  private readonly onMobileChange = (event: MediaQueryListEvent): void => {
    this.syncMobile(event.matches);
  };

  private syncMobile(matches: boolean): void {
    this.isMobile = matches;
    if (this.isMobile && this.isSearchClosing) {
      this.onSearchCloseAnimationDone();
    }
    this.cdr.markForCheck();
  }

  private clearCloseFallback(): void {
    if (this.closeFallbackId !== null) {
      clearTimeout(this.closeFallbackId);
      this.closeFallbackId = null;
    }
  }
}
