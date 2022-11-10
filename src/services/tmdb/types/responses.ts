import {
  AppendedWatchProvider,
  AppendedRelease,
  AppendedImage,
  CastCredit,
  CrewCredit,
} from './appends';
import { Genre, Movie, Person, RecentChange, WatchProvider } from './base';

/**
 * These types account for the way some api responses are packaged
 */

export type DailyFileMovie = Pick<
  Movie,
  'adult' | 'id' | 'original_title' | 'popularity' | 'video'
>;

export type DailyFilePerson = Pick<
  Person,
  'adult' | 'id' | 'name' | 'popularity'
>;

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

export interface PersonResponse extends Person {
  images: { profiles: AppendedImage[] };
}

export interface RecentChangesResponse {
  results: RecentChange[];
}

export interface WatchProviderResponse {
  results: WatchProvider[];
}
