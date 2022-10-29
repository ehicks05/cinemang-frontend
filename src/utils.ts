import { IMAGE_WIDTH } from './constants';

export const getTmdbImage = (path: string, width = `w${IMAGE_WIDTH}`, bustCache = false) =>
  `https://image.tmdb.org/t/p/${width}${path}${bustCache ? `?cache-buster=${new Date().valueOf()}` : ''}`;
