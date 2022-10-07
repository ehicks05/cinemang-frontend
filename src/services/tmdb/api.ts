import { format, subDays } from 'date-fns';
import logger from '../logger';
import tmdb from './tmdb';
import { TmdbLanguage } from './types';

export const getMovie = async (id: number) => {
  try {
    const append = 'append_to_response=releases,credits,watch/providers,images';
    const result = await tmdb.get(`/movie/${id}?${append}`);
    return result.data;
  } catch (e) {
    // if (axios.isAxiosError(e)) logger.error(e.message, { id });
  }
  return undefined;
};

export const getGenres = async () => {
  const result = await tmdb.get(`/genre/movie/list`);
  return result.data.genres;
};

export const getLanguages = async () => {
  const result = await tmdb.get(`/configuration/languages`);
  return result.data.map((lang: TmdbLanguage) => ({
    id: lang.iso_639_1,
    name: lang.english_name,
  }));
};

export const getWatchProviders = async () => {
  const result = await tmdb.get(`/watch/providers/movie`, {
    params: { watch_region: 'US' },
  });
  return result.data.results.map((r: { provider_id: string }) => ({
    ...r,
    display_priorities: undefined,
  }));
};

export const getRecentlyChangedMovieIds = async () => {
  const start_date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  try {
    const result = await tmdb.get(`/movie/changes`, { params: { start_date } });
    const ids: number[] = result.data.results.map((r: { id: number }) => r.id);
    return ids;
  } catch (e) {
    logger.error(e);
  }
};
