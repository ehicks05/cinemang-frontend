import { RESOURCES } from './constants';

export interface Cast {
  name: string;
}

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

export type ResourceKey = keyof typeof RESOURCES;

export interface TmdbPerson {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday?: string;
  gender: number;
  homepage?: string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface WatchProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}
