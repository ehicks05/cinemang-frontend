import {
  StringParam,
  withDefault,
  NumberParam,
  BooleanParam,
  DelimitedNumericArrayParam,
} from "use-query-params";

export const PAGE_SIZE = 20;

export const DEFAULT_SEARCH_FORM = {
  title: "",
  minVotes: 100,
  maxVotes: 100_000,
  minReleasedAt: "",
  maxReleasedAt: "",
  minRating: 6,
  maxRating: 10,
  language: "en",
  genre: "",
  watchProviders: [],

  sortColumn: "vote_count",
  ascending: false,
  page: 0,
};

export const QUERY_PARAMS = {
  title: withDefault(StringParam, DEFAULT_SEARCH_FORM.title),
  minVotes: withDefault(NumberParam, DEFAULT_SEARCH_FORM.minVotes),
  maxVotes: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxVotes),
  minReleasedAt: withDefault(StringParam, DEFAULT_SEARCH_FORM.minReleasedAt),
  maxReleasedAt: withDefault(StringParam, DEFAULT_SEARCH_FORM.maxReleasedAt),
  minRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.minRating),
  maxRating: withDefault(NumberParam, DEFAULT_SEARCH_FORM.maxRating),
  language: withDefault(StringParam, DEFAULT_SEARCH_FORM.language),
  genre: withDefault(StringParam, DEFAULT_SEARCH_FORM.genre),
  watchProviders: withDefault(
    DelimitedNumericArrayParam,
    DEFAULT_SEARCH_FORM.watchProviders
  ),

  sortColumn: withDefault(StringParam, DEFAULT_SEARCH_FORM.sortColumn),
  ascending: withDefault(BooleanParam, DEFAULT_SEARCH_FORM.ascending),
  page: withDefault(NumberParam, DEFAULT_SEARCH_FORM.page),
};
