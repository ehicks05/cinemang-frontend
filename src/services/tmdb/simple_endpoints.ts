import logger from '../logger';
import tmdb from './tmdb';
import {
  Language,
  PersonResponse,
  MovieResponse,
  GenreResponse,
  WatchProviderResponse,
} from './types';

export const getMovie = async (id: number) => {
  try {
    const append = 'append_to_response=releases,credits,watch/providers,images';
    const result = await tmdb.get<MovieResponse>(`/movie/${id}?${append}`);
    return result.data;
  } catch (e) {
    logger.error(e);
  }
};

export const getPerson = async (id: number) => {
  try {
    const append = 'append_to_response=images';
    const result = await tmdb.get<PersonResponse>(`/person/${id}?${append}`);
    return result.data;
  } catch (e) {
    logger.error(e);
  }
};

export const getGenres = async () => {
  const result = await tmdb.get<GenreResponse>(`/genre/movie/list`);
  return result.data.genres;
};

export const getLanguages = async () => {
  const result = await tmdb.get<Language[]>(`/configuration/languages`);
  return result.data;
};

export const getWatchProviders = async () => {
  const url = '/watch/providers/movie';
  const config = { params: { watch_region: 'US' } };
  const result = await tmdb.get<WatchProviderResponse>(url, config);
  return result.data.results;
};
