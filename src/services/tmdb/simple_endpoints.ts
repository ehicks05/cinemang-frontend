import { AxiosError } from 'axios';
import tmdb from './tmdb';
import { Language } from './types/base';
import {
  PersonResponse,
  MovieResponse,
  GenreResponse,
  WatchProviderResponse,
  TvSeriesResponse,
} from './types/responses';
import { logAxiosError } from './utils';

export const getMovie = async (id: number) => {
  try {
    const subRequests = ['releases', 'credits', 'watch/providers'];
    const config = {
      params: { append_to_response: subRequests.join(',') },
    };
    const result = await tmdb.get<MovieResponse>(`/movie/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getTvSeries = async (id: number) => {
  try {
    const subRequests = ['credits', 'watch/providers', 'content_ratings'];
    const config = {
      params: { append_to_response: subRequests.join(',') },
    };
    const result = await tmdb.get<TvSeriesResponse>(`/tv/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getTvSeason = async (seriesId: number, season: number) => {
  try {
    const result = await tmdb.get<MovieResponse>(`/tv/${seriesId}/season/${season}`);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
  }
};

export const getPerson = async (id: number) => {
  try {
    const subRequests = [''];
    const config = {
      params: { append_to_response: subRequests.join(',') },
    };
    const result = await tmdb.get<PersonResponse>(`/person/${id}`, config);
    return result.data;
  } catch (e) {
    logAxiosError(e as AxiosError);
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
