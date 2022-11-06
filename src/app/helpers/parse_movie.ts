import { Prisma } from '@prisma/client';
import { pick } from 'lodash';
import { MovieResponse } from '../../services/tmdb/types';

const MIN_VOTES = 64;

export const isValidMovie = (movie: MovieResponse) => {
  return !!(
    movie.credits.crew.find((c) => c.job === 'Director')?.name?.length &&
    movie.credits.cast
      .slice(0, 3)
      .map((c) => c.name)
      .join(', ')?.length &&
    movie.genres[0] &&
    movie.overview &&
    movie.poster_path &&
    movie.release_date &&
    movie.releases &&
    movie.runtime &&
    movie.vote_count >= MIN_VOTES
  );
};

export const parseMovie = (data: MovieResponse) => {
  const director = data.credits.crew.find((c) => c.job === 'Director')?.name;
  const cast = data.credits.cast
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ');

  // ignore movies missing required data
  if (!isValidMovie(data)) {
    return undefined;
  }

  const certification =
    data.releases.countries.find(
      (r) => r.iso_3166_1 === 'US' && r.certification,
    )?.certification || '';
  const genreId = data.genres[0].id;

  const create: Prisma.MovieCreateInput = {
    ...pick(data, ['id', 'popularity', 'title']),
    ...{ cast, certification, director, genreId },
    director: director!,
    imdbId: data.imdb_id,
    releasedAt: new Date(data.release_date),
    languageId: data.original_language,
    overview: data.overview!,
    posterPath: data.poster_path!,
    runtime: data.runtime!,
    voteCount: data.vote_count,
    voteAverage: data.vote_average,
  };
  return create;
};
