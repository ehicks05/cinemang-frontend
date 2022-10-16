import { format, subDays } from 'date-fns';
import { intersection } from 'lodash';
import logger from '../logger';
import { RESOURCE_LOCATIONS } from './constants';
import tmdb from './tmdb';
import { Genre, Language, ResourceLocationKey, WatchProvider } from './types';
import { getValidIds } from './valid_ids';

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
  const genres: Genre[] = result.data.genres;
  return genres;
};

export const getLanguages = async () => {
  const result = await tmdb.get(`/configuration/languages`);
  const languages: Language[] = result.data;
  return languages;
};

export const getWatchProviders = async () => {
  const url = '/watch/providers/movie';
  const config = { params: { watch_region: 'US' } };
  const result = await tmdb.get(url, config);
  const providers: WatchProvider[] = result.data.results;
  return providers;
};

const getRecentlyChangedIds = async (resource: ResourceLocationKey) => {
  const path = RESOURCE_LOCATIONS[resource].RECENTLY_CHANGED_PATH;
  const start_date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const config = { params: { start_date } };
  try {
    const result = await tmdb.get(`/${path}/changes`, config);
    const ids: number[] = result.data.results.map((r: { id: number }) => r.id);
    return ids;
  } catch (e) {
    logger.error(e);
  }
  return [];
};

export const getRecentlyChangedValidIds = async (
  resource: ResourceLocationKey,
) => {
  try {
    const [recentlyChangedIds, validIds] = await Promise.all([
      getRecentlyChangedIds(resource),
      getValidIds(resource),
    ]);
    return intersection(recentlyChangedIds, validIds);
  } catch (e) {
    logger.error(e);
  }
  return [];
};
