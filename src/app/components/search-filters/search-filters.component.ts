import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilters } from '../../models/search.models';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss',
  standalone: true,
  imports: [FormsModule],
})
export class SearchFiltersComponent {
  @Input({ required: true }) filters!: SearchFilters;
  @Input() mobile = false;
  @Output() filtersChange = new EventEmitter<SearchFilters>();

  @HostBinding('class.is-mobile')
  get isMobileHost(): boolean {
    return this.mobile;
  }

  onAuthorChange(author: string): void {
    this.emit({ ...this.filters, author });
  }

  setMeAsAuthor(): void {
    this.emit({ ...this.filters, author: 'Я' });
  }

  toggle(key: keyof Omit<SearchFilters, 'author'>): void {
    this.emit({ ...this.filters, [key]: !this.filters[key] });
  }

  private emit(next: SearchFilters): void {
    this.filtersChange.emit(next);
  }
}
