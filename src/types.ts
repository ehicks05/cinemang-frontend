export interface Film {
  cast: string;
  cast_credit: CastCredit[];
  crew_credit: CrewCredit[];
  director: string;
  genre_id: number;
  id: number;
  language_id: number;
  overview: string;
  poster_path: string;
  released_at: string;
  runtime: number;
  title: string;
  vote_average: number;
  vote_count: number;
  watch_provider: WatchProvider[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  count: number;
  id: number;
  name: string;
}

export interface WatchProvider {
  count: number;
  display_priority: number;
  id: number;
  logo_path: string;
  name: string;
}

export interface ISearchForm {
  ascending: boolean;
  genre?: string;
  language?: string;
  maxRating?: number;
  maxReleasedAt?: string;
  maxVotes?: number;
  minRating?: number;
  minReleasedAt?: string;
  minVotes?: number;
  page: number;

  sortColumn: string;
  title?: string;
  watchProviders?: number[];
}

export interface Video {
  id: string;
  iso_3166_1: string;
  iso_639_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface CastCredit {
  character: string;
  credit_id: string;
  id: string;
  movie: Film;
  movieId: number;
  order: number;
  person: Person;
  personId: number;
}

export interface CrewCredit {
  credit_id: string;
  department: string;
  id: string;
  job: string;
  movie: Film;
  movieId: number;
  person: Person;
  personId: number;
}

export interface Person {
  biography: string;
  birthday: string;
  cast_credit: CastCredit[];
  crew_credit: CrewCredit[];
  deathday: string;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}
