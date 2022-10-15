export interface Cast {
  name: string;
}

export type DailyFileCategory = 'movie_ids' | 'person_ids';

export interface Crew {
  name: string;
  job: string;
}

export interface DailyFileMovie {
  adult: boolean;
  id: number;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface DailyFilePerson {
  adult: boolean;
  id: number;
  name: string;
  popularity: number;
}

export type DailyFileRow = DailyFileMovie | DailyFilePerson;

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface WatchProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}
