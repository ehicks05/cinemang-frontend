import { Movie } from '@prisma/client';
import { pick } from 'lodash';
import { getMovie } from '../../services/tmdb';
import { Cast, Crew } from '../../services/tmdb/types';

export const movieIdToParsedMovie = async (
  id: number,
  knownWatchProviders: number[],
) => {
  const data = await getMovie(id);

  // ignore movies missing required data
  if (
    !data ||
    !data.credits ||
    !data.genres[0] ||
    !data.poster_path ||
    !data.release_date ||
    !data.releases ||
    !data.runtime ||
    data.vote_count < 3
  ) {
    return undefined;
  }

  const director = data.credits.crew.filter(
    (c: Crew) => c.job === 'Director',
  )[0]?.name;
  const cast = data.credits.cast.slice(0, 3).map((c: Cast) => c.name);

  // round two of ignore movies missing required data
  if (!director || !cast) {
    return undefined;
  }

  const certification = data.releases.countries.find(
    (r: { iso_3166_1: string; certification: string }) =>
      r.iso_3166_1 === 'US' && r.certification,
  )?.certification;
  const genreId = data.genres[0].id;
  const watchProviders: { provider_id: number }[] =
    data['watch/providers']?.results?.US?.flatrate || [];
  const watchProviderIds = watchProviders
    // cbs (provider_id:78) seems to be sneaking in to US results
    // so filter out providers that aren't in the watch_provider table
    .filter((wp) => knownWatchProviders.includes(wp.provider_id))
    .map((provider) => ({
      provider_id: Number(provider.provider_id),
    }));

  return {
    ...pick(data, ['id', 'title', 'overview', 'runtime']),
    imdbId: data.imdb_id,
    releasedAt: new Date(data.release_date),
    languageId: data.original_language,
    director,
    cast: cast.join(', '),
    posterPath: data.poster_path,
    certification,
    voteCount: data.vote_count,
    voteAverage: data.vote_average,
    genreId,
    watchProviders: { connect: watchProviderIds },
    updatedAt: new Date(),
  } as Movie;
};
