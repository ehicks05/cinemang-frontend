import type { Prisma } from '@prisma/client';
import { pick } from 'lodash-es';
import type { MovieResponse } from '~/services/tmdb/types/responses.js';

const parseTopNCredits = (credits: MovieResponse['credits']['cast'], n = 3) =>
	credits
		.slice(0, n)
		.map((c) => c.name)
		.join(', ');

export const parseMovie = (data: MovieResponse) => {
	// ignore movies missing required data
	if (
		!(
			data.credits?.crew.find((c) => c.job === 'Director')?.name?.length &&
			parseTopNCredits(data.credits.cast)?.length &&
			data.genres[0] &&
			data.imdb_id &&
			data.overview &&
			data.poster_path &&
			data.release_date &&
			data.releases &&
			data.runtime &&
			data.vote_count >= 64
		)
	) {
		return undefined;
	}

	const director = data.credits.crew.find((c) => c.job === 'Director')?.name || '';
	const cast = parseTopNCredits(data.credits.cast);
	const certification =
		data.releases.countries.find((r) => r.iso_3166_1 === 'US' && r.certification)
			?.certification || '';
	const genreId = data.genres[0].id;

	const create: Prisma.MovieCreateInput = {
		...pick(data, ['id', 'popularity', 'title']),
		...{ cast, certification, director, genreId },
		imdbId: data.imdb_id as string,
		releasedAt: new Date(data.release_date),
		languageId: data.original_language,
		overview: data.overview,
		posterPath: data.poster_path,
		runtime: data.runtime,
		voteCount: data.vote_count,
		voteAverage: data.vote_average,
	};
	return create;
};
