import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilters } from '../../models/search.models';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-mobile]': 'mobile()',
  },
})
export class SearchFiltersComponent {
  readonly filters = input.required<SearchFilters>();
  readonly mobile = input(false);
  readonly filtersChange = output<SearchFilters>();

  onAuthorChange(author: string): void {
    this.emit({ ...this.filters(), author });
  }

  setMeAsAuthor(): void {
    this.emit({ ...this.filters(), author: 'Я' });
  }

  toggle(key: keyof Omit<SearchFilters, 'author'>): void {
    const filters = this.filters();
    this.emit({ ...filters, [key]: !filters[key] });
  }

  private emit(next: SearchFilters): void {
    this.filtersChange.emit(next);
  }
}
