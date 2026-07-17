import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss',
  standalone: true,
})
export class SearchHistoryComponent {
  @Input({ required: true }) items: string[] = [];
  @Output() select = new EventEmitter<string>();
}
