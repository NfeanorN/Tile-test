import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NavLinkItem } from '../../models/nav.models';

@Component({
  selector: 'app-nav-links',
  templateUrl: './nav-links.component.html',
  styleUrl: './nav-links.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLinksComponent {
  readonly items = input.required<NavLinkItem[]>();
  readonly activeId = input<string | null>('');
  readonly itemClick = output<string>();
}
