import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilters } from '../../models/search.models';
import { SearchHistoryComponent } from '../search-history/search-history.component';
import { SearchFiltersComponent } from '../search-filters/search-filters.component';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [FormsModule, SearchHistoryComponent, SearchFiltersComponent],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
})
export class SearchPanelComponent implements AfterViewInit {
  @Input() query = '';
  @Input({ required: true }) history: string[] = [];
  @Input({ required: true }) filters!: SearchFilters;
  @Input() dropdownOpen = true;
  @Input() closing = false;
  @Input() mobile = false;

  @Output() queryChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<SearchFilters>();
  @Output() historySelect = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() submitSearch = new EventEmitter<string>();
  @Output() closeAnimationDone = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @HostBinding('class.is-closing')
  get isClosing(): boolean {
    return this.closing;
  }

  @HostBinding('class.is-mobile')
  get isMobileHost(): boolean {
    return this.mobile;
  }

  ngAfterViewInit(): void {
    if (!this.closing) {
      queueMicrotask(() => this.searchInput?.nativeElement.focus());
    }
  }

  @HostListener('animationend', ['$event'])
  onAnimationEnd(event: AnimationEvent): void {
    if (!this.closing) {
      return;
    }

    const name = event.animationName;
    if (name === 'field-out' || name === 'mobile-out') {
      this.closeAnimationDone.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.closing) {
      this.close.emit();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitSearch.emit(this.query.trim());
  }

  onHistorySelect(term: string): void {
    this.queryChange.emit(term);
    this.historySelect.emit(term);
    this.searchInput?.nativeElement.focus();
  }
}
