import { Database } from './generated/supabase';

// Prefix with 'T' if we need to hydrate joined tables
export type TCastCredit = Database['cinemang']['Tables']['cast_credit']['Row'];
export type TCrewCredit = Database['cinemang']['Tables']['crew_credit']['Row'];
export type Genre = Database['cinemang']['Tables']['genre']['Row'];
export type Language = Database['cinemang']['Tables']['language']['Row'];
export type TPerson = Database['cinemang']['Tables']['person']['Row'];
export type TMovie = Database['cinemang']['Tables']['movie']['Row'];
export type WatchProvider = Database['cinemang']['Tables']['watch_provider']['Row'];

export interface CastCredit extends TCastCredit {
  movie: Film;
  person: TPerson;
}
export interface CrewCredit extends TCrewCredit {
  movie: Film;
  person: TPerson;
}

export interface Film extends TMovie {
  cast_credit: CastCredit[];
  crew_credit: CrewCredit[];
  watch_provider: WatchProvider[];
}

export interface Person extends TPerson {
  cast_credit: CastCredit[];
  crew_credit: CrewCredit[];
}

export interface ISearchForm {
  ascending: boolean;
  genre?: string;
  language?: string;
  maxRating?: number;
  maxReleasedAt?: string;
  maxVotes?: number;
  minRating?: number;
  minReleasedAt?: string;
  minVotes?: number;
  page: number;

  sortColumn: string;
  title?: string;
  watchProviders?: number[];
}

export interface Video {
  id: string;
  iso_3166_1: string;
  iso_639_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}
