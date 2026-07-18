import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  input,
  output,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-closing]': 'closing()',
    '[class.is-mobile]': 'mobile()',
  },
})
export class SearchPanelComponent implements AfterViewInit {
  readonly query = input('');
  readonly history = input.required<string[]>();
  readonly filters = input.required<SearchFilters>();
  readonly dropdownOpen = input(true);
  readonly closing = input(false);
  readonly mobile = input(false);

  readonly queryChange = output<string>();
  readonly filtersChange = output<SearchFilters>();
  readonly historySelect = output<string>();
  readonly close = output<void>();
  readonly submitSearch = output<string>();
  readonly closeAnimationDone = output<void>();

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (!this.closing()) {
      queueMicrotask(() => this.searchInput?.nativeElement.focus());
    }
  }

  @HostListener('animationend', ['$event'])
  onAnimationEnd(event: AnimationEvent): void {
    if (!this.closing()) {
      return;
    }

    const name = event.animationName;
    if (name === 'field-out' || name === 'mobile-out') {
      this.closeAnimationDone.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.closing()) {
      this.close.emit();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitSearch.emit(this.query().trim());
  }

  onHistorySelect(term: string): void {
    this.queryChange.emit(term);
    this.historySelect.emit(term);
    this.searchInput?.nativeElement.focus();
  }
}
