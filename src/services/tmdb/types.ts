import { RESOURCES } from './constants';

export type DailyFileMovie = Pick<
  Movie,
  'adult' | 'id' | 'original_title' | 'popularity' | 'video'
>;

export type DailyFilePerson = Pick<
  Person,
  'adult' | 'id' | 'name' | 'popularity'
>;

export type DailyFileRow = DailyFileMovie | DailyFilePerson;

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export type ResourceKey = keyof typeof RESOURCES;

export type TmdbMovieStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';

export type TmdbTvStatus =
  | 'Returning Series'
  | 'Planned'
  | 'In Production'
  | 'Ended'
  | 'Canceled'
  | 'Pilot';

export interface Movie {
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: any;
  budget: number;
  genres: Genre[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  original_language: string;
  original_title: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime?: number;
  spoken_languages: Language[];
  status: TmdbMovieStatus;
  tagline?: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TV {
  adult: boolean;
  backdrop_path?: string;
  created_by: Pick<
    CrewCredit,
    'id' | 'credit_id' | 'name' | 'gender' | 'profile_path'
  >[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage?: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: any;
  name: string;
  next_episode_to_air: any;
  networks: any[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: any[];
  spoken_languages: Language[];
  status: TmdbTvStatus;
  tagline?: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse extends Movie {
  credits: { cast: CastCredit[]; crew: CrewCredit[] };
  'watch/providers': {
    results: Record<
      string,
      {
        link: string;
        flatrate: AppendedWatchProvider[];
        buy: AppendedWatchProvider[];
        rent: AppendedWatchProvider[];
      }
    >;
  };
  releases: { countries: AppendedRelease[] };
  images: {
    backdrops: AppendedImage[];
    logos: AppendedImage[];
    posters: AppendedImage[];
  };
}

export interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday?: string;
  gender: 0 | 1 | 2 | 3;
  homepage?: string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth?: string;
  popularity: number;
  profile_path?: string;
}

export interface PersonResponse extends Person {
  images: { profiles: AppendedImage[] };
}

export type AppendedPerson = Pick<
  Person,
  | 'adult'
  | 'gender'
  | 'id'
  | 'known_for_department'
  | 'name'
  | 'popularity'
  | 'profile_path'
>;

export interface CastCredit extends AppendedPerson {
  original_name: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewCredit extends AppendedPerson {
  original_name: string;
  credit_id: string;
  department: string;
  job: string;
}

export type Credit = CastCredit | CrewCredit;

export interface WatchProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}

export interface WatchProviderResponse {
  results: WatchProvider[];
}

export type AppendedWatchProvider = Omit<WatchProvider, 'display_priority'>;

export interface ProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface AppendedRelease {
  certification: string;
  iso_3166_1: string;
  primary: boolean;
  release_date: string;
}

export interface AppendedImage {
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface RecentChange {
  id: number;
  adult: boolean;
}

export interface RecentChangesResponse {
  results: RecentChange[];
}
