export type NavIcon =
  | 'links'
  | 'contacts'
  | 'tags'
  | 'favorites'
  | 'visits';

export interface NavLinkItem {
  id: string;
  label: string;
  icon: NavIcon;
}

export const NAV_ITEMS: NavLinkItem[] = [
  { id: 'links', label: 'Ссылки', icon: 'links' },
  { id: 'contacts', label: 'Контакты', icon: 'contacts' },
  { id: 'tags', label: 'Теги', icon: 'tags' },
  { id: 'favorites', label: 'Избранное', icon: 'favorites' },
  { id: 'visits', label: 'Посещения', icon: 'visits' },
];
