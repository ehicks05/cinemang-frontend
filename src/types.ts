export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
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
  netflix?: boolean;
  amazonPrimeVideo?: boolean;

  sortColumn: string;
  ascending: boolean;
  page: number;
}