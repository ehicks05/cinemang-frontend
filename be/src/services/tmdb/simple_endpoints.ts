import { GenreType } from '@prisma/client';
import axios, { type AxiosError } from 'axios';
import { groupBy } from 'lodash';
import logger from '~/services/logger.js';
import tmdb from './tmdb.js';
import type { Language } from './types/base.js';
import type {
	GenreResponse,
	MovieResponse,
	PersonResponse,
	ProviderResponse,
	SeasonResponse,
	ShowResponse,
} from './types/responses.js';
import { logAxiosError } from './utils.js';

export const getMovie = async (id: number) => {
	try {
		const append = ['releases', 'credits', 'watch/providers'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const result = await tmdb.get<MovieResponse>(`/movie/${id}`, config);
		return result.data;
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getShow = async (id: number) => {
	try {
		const append = ['credits', 'watch/providers', 'content_ratings'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const result = await tmdb.get<ShowResponse>(`/tv/${id}`, config);
		return result.data;
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getSeason = async (showId: number, season: number) => {
	try {
		const append = ['credits'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const path = `/tv/${showId}/season/${season}`;
		const result = await tmdb.get<SeasonResponse>(path, config);
		return result.data;
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getPerson = async (id: number) => {
	try {
		const append = [''];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const result = await tmdb.get<PersonResponse>(`/person/${id}`, config);
		return result.data;
	} catch (e) {
		if (axios.isAxiosError(e)) {
			logAxiosError(e);
		} else {
			logger.error(e);
		}

		return { id, error: e || new Error('something went wrong') };
	}
};

const getMovieGenres = async () => {
	const result = await tmdb.get<GenreResponse>('/genre/movie/list');
	return result.data.genres;
};

const getShowGenres = async () => {
	const result = await tmdb.get<GenreResponse>('/genre/tv/list');
	return result.data.genres;
};

export const getGenres = async () => {
	const movieGenres = (await getMovieGenres()).map((o) => ({
		...o,
		type: GenreType.MOVIE,
	}));
	const showGenres = (await getShowGenres()).map((o) => ({
		...o,
		type: GenreType.SHOW,
	}));

	const genresById = groupBy([...movieGenres, ...showGenres], (o) => o.id);
	const genres = Object.values(genresById).map((o) =>
		o.length === 1 ? o[0] : { ...o[0], type: GenreType.BOTH },
	);

	return genres;
};

export const getLanguages = async () => {
	const result = await tmdb.get<Language[]>('/configuration/languages');
	return result.data;
};

export const getProviders = async () => {
	const url = '/watch/providers/movie';
	const config = { params: { watch_region: 'US' } };
	const result = await tmdb.get<ProviderResponse>(url, config);
	return result.data.results;
};
