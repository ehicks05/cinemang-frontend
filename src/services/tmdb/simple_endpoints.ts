import { AxiosError } from 'axios';
import { pick } from 'lodash';
import logger from '../logger';
import tmdb from './tmdb';
import { Language } from './types/base';
import {
  PersonResponse,
  MovieResponse,
  GenreResponse,
  WatchProviderResponse,
} from './types/responses';

export const logAxiosError = (error: AxiosError) => {
  const config = pick(error.config, ['baseURL', 'url', 'params']);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status, headers } = error.response;
    if (status === 404) logger.error({ status, url: config.url });
    else logger.error({ data, status, config /* headers */ });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    logger.error({ request: error.request, config });
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error({ errorMessage: error.message, config });
  }
};

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
