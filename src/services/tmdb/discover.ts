import P from 'bluebird';
import { range } from 'lodash';
import tmdb from './tmdb';

const MIN_VOTES = 64;
const START_YEAR = 2023;

const YEAR_KEY = {
  movie: 'primary_release_year',
  tv: 'first_air_date_year',
};

const getIdsForYear = async (media: 'movie' | 'tv', year: number) => {
  const path = `/discover/${media}?&vote_count.gte=${MIN_VOTES}&${YEAR_KEY[media]}=${year}`;
  const { data } = await tmdb.get(path);

  const ids: number[] = data.results.map((o: { id: number }) => o.id);
  const pages = data.total_pages;

  let page = 1;
  while (page < pages) {
    page += 1;
    const { data } = await tmdb.get(`${path}&page=${page}`);
    ids.push(data.results.map((o: { id: number }) => o.id));
  }

  return ids.flat();
};

export const discoverMediaIds = async (media: 'movie' | 'tv') => {
  const years = range(START_YEAR, new Date().getFullYear() + 1);
  const idsByYear = await P.map(years, (year: number) => getIdsForYear(media, year));
  return idsByYear.flat();
};
