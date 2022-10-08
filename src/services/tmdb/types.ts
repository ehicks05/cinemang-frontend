export interface Cast {
  name: string;
}

export interface Crew {
  name: string;
  job: string;
}

export interface DailyFileRow {
  adult: boolean;
  id: number;
  original_title: string;
  popularity: number;
  video: boolean;
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

export interface WatchProvider {
  display_priorities: Record<string, number>;
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}
