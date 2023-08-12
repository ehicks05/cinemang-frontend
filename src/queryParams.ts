import {
  StringParam,
  withDefault,
  NumberParam,
  BooleanParam,
  DelimitedNumericArrayParam,
  createEnumParam,
} from 'use-query-params';

export const DEFAULT_SEARCH_FORM = {
  ascending: false,
  creditName: '',
  genre: '',
  language: '',
  maxRating: 10,
  maxVotes: 100_000,
  minRating: 6,
  page: 0,
  providers: [] as number[],
  sortColumn: 'released_at',
} as const;

export const DEFAULT_MOVIE_SEARCH_FORM = {
  ...DEFAULT_SEARCH_FORM,
  maxReleasedAt: '',
  minReleasedAt: '',
  minVotes: 500,
  title: '',
  sortColumn: 'released_at',
} as const;

export const DEFAULT_TV_SEARCH_FORM = {
  ...DEFAULT_SEARCH_FORM,
  maxFirstAirDate: '',
  minFirstAirDate: '',
  minVotes: 300,
  name: '',
  sortColumn: 'first_air_date',
} as const;

export const QUERY_PARAMS = {
  ascending: withDefault(BooleanParam, DEFAULT_SEARCH_FORM.ascending),
  creditName: withDefault(StringParam, DEFAULT_SEARCH_FORM.creditName),
  genre: withDefault(StringParam, DEFAULT_SEARCH_FORM.genre),
  language: withDefault(StringParam, DEFAULT_SEARCH_FORM.language),
  maxRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxRating),
  maxVotes: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxVotes),
  minRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.minRating),
  page: withDefault(NumberParam, DEFAULT_SEARCH_FORM.page),
  providers: withDefault(DelimitedNumericArrayParam, DEFAULT_SEARCH_FORM.providers),
};

export const MOVIE_QUERY_PARAMS = {
  ...QUERY_PARAMS,
  maxReleasedAt: withDefault(StringParam, DEFAULT_MOVIE_SEARCH_FORM.maxReleasedAt),
  minReleasedAt: withDefault(StringParam, DEFAULT_MOVIE_SEARCH_FORM.minReleasedAt),
  minVotes: withDefault(NumberParam, DEFAULT_MOVIE_SEARCH_FORM.minVotes),
  sortColumn: withDefault(
    createEnumParam(['vote_count', 'vote_average', 'released']),
    DEFAULT_MOVIE_SEARCH_FORM.sortColumn,
  ),
  title: withDefault(StringParam, DEFAULT_MOVIE_SEARCH_FORM.title),
};

export const SHOW_QUERY_PARAMS = {
  ...QUERY_PARAMS,
  maxFirstAirDate: withDefault(StringParam, DEFAULT_TV_SEARCH_FORM.maxFirstAirDate),
  minFirstAirDate: withDefault(StringParam, DEFAULT_TV_SEARCH_FORM.minFirstAirDate),
  minVotes: withDefault(NumberParam, DEFAULT_TV_SEARCH_FORM.minVotes),
  name: withDefault(StringParam, DEFAULT_TV_SEARCH_FORM.name),
  sortColumn: withDefault(
    createEnumParam(['vote_count', 'vote_average', 'first_air_date']),
    DEFAULT_TV_SEARCH_FORM.sortColumn,
  ),
};
