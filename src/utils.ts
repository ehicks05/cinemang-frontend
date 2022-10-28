import { IMAGE_WIDTH } from './constants';

export const getTmdbImage = (path: string, width = `w${IMAGE_WIDTH}`) =>
  `https://image.tmdb.org/t/p/${width}${path}`;
