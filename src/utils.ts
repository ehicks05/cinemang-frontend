import { IMAGE_WIDTH } from './constants';

interface Params {
	defaultImage?: string;
	path?: string;
	width?: string;
}

export const getTmdbImage = ({
	path,
	width = `w${IMAGE_WIDTH}`,
	defaultImage = '/92x138.png',
}: Params) => {
	if (!path) return defaultImage;
	return `https://image.tmdb.org/t/p/${width}${path}`;
};
