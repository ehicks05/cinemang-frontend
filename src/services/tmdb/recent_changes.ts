import { format, subDays } from 'date-fns';
import { intersection } from 'lodash';
import logger from '../logger';
import { RecentChangeCompatibleResource, RESOURCES } from './constants';
import tmdb from './tmdb';
import { RecentChangesResponse } from './types/responses';
import { getValidIds } from './valid_ids';

const getRecentlyChangedIds = async (
  resource: RecentChangeCompatibleResource,
) => {
  if (!['MOVIE', 'PERSON'].includes(resource)) return;

  const path = RESOURCES[resource].RECENTLY_CHANGED_PATH;
  const url = `/${path}/changes`;
  const start_date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const config = { params: { start_date } };
  try {
    const result = await tmdb.get<RecentChangesResponse>(url, config);
    return result.data.results.map((r) => r.id);
  } catch (e) {
    logger.error(e);
  }
  return [];
};

export const getRecentlyChangedValidIds = async (
  resource: RecentChangeCompatibleResource,
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
