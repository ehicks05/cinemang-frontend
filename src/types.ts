export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
  count: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  display_priority: number;
  logo_path: string;
  count: number;
}

export interface ISearchForm {
  title?: string;
  minVotes?: number;
  maxVotes?: number;
  minReleasedAt?: string;
  maxReleasedAt?: string;
  minRating?: number;
  maxRating?: number;
  language?: string;
  genre?: string;
  watchProviders?: number[];

  sortColumn: string;
  ascending: boolean;
  page: number;
}
