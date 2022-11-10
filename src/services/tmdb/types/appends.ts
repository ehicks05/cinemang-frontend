import { string } from 'zod';
import { Company, Person, WatchProvider } from './base';

/**
 * Variations of the base types that generally omit a few fields
 */

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

export interface AppendedImage {
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface AppendedRelease {
  certification: string;
  iso_3166_1: string;
  primary: boolean;
  release_date: string;
}

export type AppendedWatchProvider = Omit<WatchProvider, 'display_priority'>;
