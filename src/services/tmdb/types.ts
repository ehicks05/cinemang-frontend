export interface TmdbLanguage {
  iso_639_1: string;
  english_name: string;
}

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
