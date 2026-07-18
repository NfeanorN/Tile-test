import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavLinkItem } from '../../models/nav.models';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrl: './nav-links.component.scss',
  standalone: true,
})
export class NavLinksComponent {
  @Input({ required: true }) items: NavLinkItem[] = [];
  @Input() activeId: string | null = '';
  @Output() itemClick = new EventEmitter<string>();
}
