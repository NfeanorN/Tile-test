import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { NavLinksComponent } from '../nav-links/nav-links.component';
import { SearchPanelComponent } from '../search-panel/search-panel.component';
import { NAV_ITEMS, NavLinkItem } from '../../models/nav.models';
import { DEFAULT_FILTERS, SearchFilters } from '../../models/search.models';

@Component({
  selector: 'app-header',
  imports: [NavLinksComponent, SearchPanelComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly navItems: NavLinkItem[] = NAV_ITEMS;
  public readonly notificationCount = 32;

  public readonly activeNavId = signal('');
  public readonly isSearchOpen = signal(false);
  public readonly isSearchClosing = signal(false);
  public readonly isMobile = signal(false);
  public readonly searchQuery = signal('');
  public readonly filters = signal<SearchFilters>({ ...DEFAULT_FILTERS });
  public readonly history = signal([
    'закрепить теги',
    'кнопка',
    'приложение',
    'форма',
    'текстовое поле',
  ]);

  public readonly showSearchPanel = computed(
    () => this.isSearchOpen() || this.isSearchClosing(),
  );

  private readonly mobileMqQuery = '(max-width: 900px)';
  private closeFallbackId: ReturnType<typeof setTimeout> | null = null;
  private mobileMq?: MediaQueryList;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.mobileMq = window.matchMedia(this.mobileMqQuery);
    this.syncMobile(this.mobileMq.matches);
    this.mobileMq.addEventListener('change', this.onMobileChange);
  }

  ngOnDestroy(): void {
    this.mobileMq?.removeEventListener('change', this.onMobileChange);
    this.clearCloseFallback();
  }

  openSearch(): void {
    this.clearCloseFallback();
    this.isSearchClosing.set(false);
    this.isSearchOpen.set(true);
  }

  closeSearch(): void {
    if (!this.isSearchOpen() || this.isSearchClosing()) {
      return;
    }

    this.isSearchOpen.set(false);
    this.isSearchClosing.set(true);
    this.clearCloseFallback();
    this.closeFallbackId = setTimeout(
      () => this.onSearchCloseAnimationDone(),
      280,
    );
  }

  onSearchCloseAnimationDone(): void {
    if (!this.isSearchClosing()) {
      return;
    }

    this.clearCloseFallback();
    this.isSearchClosing.set(false);
    this.searchQuery.set('');
  }

  onFiltersChange(filters: SearchFilters): void {
    this.filters.set(filters);
  }

  onHistorySelect(term: string): void {
    this.searchQuery.set(term);
  }

  onSubmitSearch(query: string): void {
    if (!query) {
      return;
    }

    const history = this.history();
    if (!history.includes(query)) {
      this.history.set([query, ...history].slice(0, 8));
    }

    console.log('Search:', { query, filters: this.filters() });
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.isSearchOpen() || this.isSearchClosing() || this.isMobile()) {
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
    this.isMobile.set(matches);
    if (matches && this.isSearchClosing()) {
      this.onSearchCloseAnimationDone();
    }
  }

  private clearCloseFallback(): void {
    if (this.closeFallbackId !== null) {
      clearTimeout(this.closeFallbackId);
      this.closeFallbackId = null;
    }
  }
}
