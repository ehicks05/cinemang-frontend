import { format, subDays } from 'date-fns';
import { RecentChangeCompatibleResource, RESOURCES } from './constants';
import tmdb from './tmdb';
import { RecentChangesResponse } from './types/responses';

export const getRecentlyChangedIds = async (
  resource: RecentChangeCompatibleResource,
) => {
  const path = RESOURCES[resource].RECENTLY_CHANGED_PATH;

  const url = `/${path}/changes`;
  const start_date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const config = { params: { start_date } };

  const { data } = await tmdb.get<RecentChangesResponse>(url, config);

  const ids: number[] = data.results.map((o: { id: number }) => o.id);
  const pages = data.total_pages;

  let page = 1;
  while (page < pages) {
    page += 1;
    const config = { params: { start_date, page } };
    const { data } = await tmdb.get(`${url}`, config);
    ids.push(data.results.map((o: { id: number }) => o.id));
  }

  return ids;
};
