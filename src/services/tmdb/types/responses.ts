import {
  AppendedWatchProvider,
  AppendedRelease,
  AppendedImage,
  CastCredit,
  CrewCredit,
  AppendedContentRating,
} from './appends';
import { Genre, Movie, Person, RecentChange, TvSeries, WatchProvider } from './base';

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

export interface MovieResponse extends Movie {
  credits: { cast: CastCredit[]; crew: CrewCredit[] };
  images: {
    backdrops: AppendedImage[];
    logos: AppendedImage[];
    posters: AppendedImage[];
  };
  releases: { countries: AppendedRelease[] };
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
}

export interface TvSeriesResponse extends TvSeries {
  credits: { cast: CastCredit[]; crew: CrewCredit[] };
  images: {
    backdrops: AppendedImage[];
    logos: AppendedImage[];
    posters: AppendedImage[];
  };
  content_ratings: { results: AppendedContentRating[] };
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
}

export type MediaResponse = MovieResponse | TvSeriesResponse;

export interface PersonResponse extends Person {
  images: { profiles: AppendedImage[] };
}

export interface RecentChangesResponse {
  results: RecentChange[];
}

export interface WatchProviderResponse {
  results: WatchProvider[];
}
