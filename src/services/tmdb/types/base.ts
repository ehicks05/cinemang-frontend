import { CastCredit, CrewCredit } from './appends';
import { TmdbMovieStatus, TmdbTvStatus } from './enums';

export interface Company {
  description: string;
  headquarters: string;
  homepage: string;
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
  parent_company?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface Media {
  adult: boolean;
  backdrop_path?: string;
  genres: Genre[];
  homepage?: string;
  id: number;
  original_language: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: Language[];
  status: string;
  tagline?: string;
  vote_average: number;
  vote_count: number;
}

export interface Movie extends Media {
  belongs_to_collection?: any;
  budget: number;
  imdb_id?: string;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime?: number;
  status: TmdbMovieStatus;
  title: string;
  video: boolean;
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

export type ProductionCompany = Pick<
  Company,
  'id' | 'logo_path' | 'name' | 'origin_country'
>;

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface RecentChange {
  id: number;
  adult: boolean;
}

export interface TvSeries extends Media {
  created_by: Pick<
    CrewCredit,
    'id' | 'credit_id' | 'name' | 'gender' | 'profile_path'
  >[];
  episode_run_time: number[];
  first_air_date: string;
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
  original_name: string;
  seasons: TvSeasonSummary[];
  spoken_languages: Language[];
  status: TmdbTvStatus;
  type: string;
}

export type TvSeasonSummary = Omit<TvSeason, 'episodes' | '_id'> & {
  episode_count: number;
};

export interface TvSeason {
  _id: string;
  air_date: string;
  episodes: TvEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path?: string;
  season_number: number;
}

export interface TvEpisode {
  air_date: string;
  crew: CrewCredit[];
  episode_number: number;
  guest_stars: CastCredit[];
  id: number;
  name: string;
  overview: string;
  production_code?: string;
  season_number: number;
  still_path?: string;
  vote_average: number;
  vote_count: number;
}

export interface WatchProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}
