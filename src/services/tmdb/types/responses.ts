import {
  AppendedRelease,
  CastCredit,
  CrewCredit,
  AppendedContentRating,
  AppendedProviders,
  AppendedImages,
  AppendedImage,
} from './appends';
import { Genre, Movie, Person, RecentChange, Show, Provider, Season } from './base';

/**
 * These types account for the way some api responses are packaged
 */

export type DailyFileMovie = Pick<
  Movie,
  'adult' | 'id' | 'original_title' | 'popularity' | 'video'
>;

export type DailyFilePerson = Pick<Person, 'adult' | 'id' | 'name' | 'popularity'>;

export type DailyFileRow = DailyFileMovie | DailyFilePerson;

export interface GenreResponse {
  genres: Genre[];
}

export interface MovieResponse extends Movie, AppendedImages, AppendedProviders {
  credits: { cast: CastCredit[]; crew: CrewCredit[] };
  releases: { countries: AppendedRelease[] };
}

export interface ShowResponse extends Show, AppendedImages, AppendedProviders {
  credits: { cast: CastCredit[]; crew: CrewCredit[] };
  content_ratings: { results: AppendedContentRating[] };
}

export type MediaResponse = MovieResponse | ShowResponse;

export interface PersonResponse extends Person {
  images: { profiles: AppendedImage[] };
}

export interface RecentChangesResponse {
  results: RecentChange[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface ProviderResponse {
  results: Provider[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SeasonResponse extends Season {}
