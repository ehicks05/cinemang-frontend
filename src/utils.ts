import { IMAGE_WIDTH } from './constants';

interface Params {
  bustCache?: boolean;
  defaultImage?: string;
  path?: string;
  width?: string;
}

export const getTmdbImage = ({
  path,
  width = `w${IMAGE_WIDTH}`,
  bustCache = false,
  defaultImage = '/92x138.png',
}: Params) => {
  if (!path) return defaultImage;
  const cacheBuster = bustCache ? `?cache-buster=${new Date().valueOf()}` : '';
  return `https://image.tmdb.org/t/p/${width}${path}${cacheBuster}`;
};
