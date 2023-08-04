import { Prisma } from '@prisma/client';
import { TvSeriesResponse } from '../../services/tmdb/types/responses';

const MIN_VOTES = 64;

export const isValid = (series: TvSeriesResponse) =>
  !!(
    series.credits &&
    series.credits.cast
      .slice(0, 3)
      .map(c => c.name)
      .join(', ')?.length &&
    series.genres[0] &&
    series.overview &&
    series.poster_path &&
    series.content_ratings?.results.find(r => r.iso_3166_1 === 'US' && r.rating) &&
    series.vote_count >= MIN_VOTES
  );

export const parseTvSeries = (data: TvSeriesResponse) => {
  if (!isValid(data)) {
    return undefined;
  }

  const cast = data.credits.cast
    .slice(0, 3)
    .map(c => c.name)
    .join(', ');
  const contentRating =
    data.content_ratings?.results.find(r => r.iso_3166_1 === 'US' && r.rating)
      ?.rating || '';
  const genreId = data.genres[0].id;

  const create: Prisma.TvSeriesCreateInput = {
    id: data.id,
    name: data.name,
    popularity: data.popularity,
    status: data.status,
    tagline: data.tagline,
    ...{ cast, contentRating, genreId },
    // createdBy: data.created_by[0].id,
    firstAirDate: new Date(data.first_air_date),
    languageId: data.original_language,
    lastAirDate: new Date(data.last_air_date),
    overview: data.overview!,
    posterPath: data.poster_path!,
    voteCount: data.vote_count,
    voteAverage: data.vote_average,
  };
  return create;
};
