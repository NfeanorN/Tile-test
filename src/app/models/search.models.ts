export interface SearchFilters {
  author: string;
  iAmParticipant: boolean;
  strictSearch: boolean;
  inTitles: boolean;
  onlyTags: boolean;
  onlyRequests: boolean;
  onlyContacts: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
  author: '',
  iAmParticipant: false,
  strictSearch: false,
  inTitles: false,
  onlyTags: false,
  onlyRequests: false,
  onlyContacts: false,
};
