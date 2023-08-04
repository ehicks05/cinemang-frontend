import { Database } from './generated/supabase';

// Prefix with 'T' if we need to hydrate joined tables
export type TCredit = Database['public']['Tables']['credit']['Row'];
export type Genre = Database['public']['Tables']['genre']['Row'];
export type Language = Database['public']['Tables']['language']['Row'];
export type TPerson = Database['public']['Tables']['person']['Row'];
export type TMovie = Database['public']['Tables']['movie']['Row'];
export type TTvSeries = Database['public']['Tables']['tv_series']['Row'];
export type WatchProvider = Database['public']['Tables']['watch_provider']['Row'];

export interface Credit extends TCredit {
  movie?: Film;
  series?: TTvSeries;
  person: TPerson;
}

export interface Film extends TMovie {
  credits: Credit[];
  watch_provider: WatchProvider[];
}

export interface TvSeries extends TTvSeries {
  credits: Credit[];
  watch_provider: WatchProvider[];
}

export interface Person extends TPerson {
  credits: Credit[];
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
