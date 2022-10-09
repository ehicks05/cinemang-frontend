import {
  StringParam,
  withDefault,
  NumberParam,
  BooleanParam,
  DelimitedNumericArrayParam,
} from 'use-query-params';

export const PAGE_SIZE = 20;

export const DEFAULT_SEARCH_FORM = {
  ascending: false,
  genre: '',
  language: 'en',
  maxRating: 10,
  maxReleasedAt: '',
  maxVotes: 100_000,
  minRating: 6,
  minReleasedAt: '',
  minVotes: 100,
  page: 0,
  sortColumn: 'vote_count',
  title: '',
  watchProviders: [],
};

export const QUERY_PARAMS = {
  ascending: withDefault(BooleanParam, DEFAULT_SEARCH_FORM.ascending),
  genre: withDefault(StringParam, DEFAULT_SEARCH_FORM.genre),
  language: withDefault(StringParam, DEFAULT_SEARCH_FORM.language),
  maxRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxRating),
  maxReleasedAt: withDefault(StringParam, DEFAULT_SEARCH_FORM.maxReleasedAt),
  maxVotes: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxVotes),
  minRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.minRating),
  minReleasedAt: withDefault(StringParam, DEFAULT_SEARCH_FORM.minReleasedAt),
  minVotes: withDefault(NumberParam, DEFAULT_SEARCH_FORM.minVotes),
  page: withDefault(NumberParam, DEFAULT_SEARCH_FORM.page),
  sortColumn: withDefault(StringParam, DEFAULT_SEARCH_FORM.sortColumn),
  title: withDefault(StringParam, DEFAULT_SEARCH_FORM.title),
  watchProviders: withDefault(
    DelimitedNumericArrayParam,
    DEFAULT_SEARCH_FORM.watchProviders,
  ),
};
