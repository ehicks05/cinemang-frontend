import type { Prisma } from '@prisma/client';
import type { ShowResponse } from '~/services/tmdb/types/responses.js';

const MIN_VOTES = 64;

export const isValid = (show: ShowResponse) =>
	!!(
		show.credits?.cast
			.slice(0, 3)
			.map((c) => c.name)
			.join(', ')?.length &&
		show.genres[0] &&
		show.overview &&
		show.poster_path &&
		show.content_ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating) &&
		show.vote_count >= MIN_VOTES
	);

export const parseShow = (data: ShowResponse) => {
	if (!isValid(data)) {
		return undefined;
	}

	const cast = data.credits.cast
		.slice(0, 3)
		.map((c) => c.name)
		.join(', ');
	const contentRating =
		data.content_ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating)
			?.rating || '';
	const genreId = data.genres[0].id;

	const create: Prisma.ShowUncheckedCreateInput = {
		id: data.id,
		name: data.name,
		popularity: data.popularity,
		status: data.status,
		tagline: data.tagline,
		...{ cast, contentRating, genreId },
		createdBy:
			data.created_by
				.slice(0, 3)
				.map((o) => o.name)
				.join(', ') || '',
		firstAirDate: new Date(data.first_air_date),
		languageId: data.original_language,
		lastAirDate: new Date(data.last_air_date),
		overview: data.overview || '',
		posterPath: data.poster_path || '',
		voteCount: data.vote_count,
		voteAverage: data.vote_average,
	};
	return create;
};
