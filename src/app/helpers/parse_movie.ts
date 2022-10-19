import { Movie } from '@prisma/client';
import { pick } from 'lodash';
import { getMovie } from '../../services/tmdb';
import { RESOURCES } from '../../services/tmdb/constants';
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
      id: Number(provider.provider_id),
    }));

  const castCredits = data.credits.cast
    .filter(
      (c: { popularity: number }) =>
        c.popularity >= RESOURCES['PERSON'].MIN_POPULARITY,
    )
    .map(
      (c: {
        id: number;
        cast_id: number;
        character: string;
        credit_id: string;
        order: number;
      }) => ({
        castId: c.cast_id,
        creditId: c.credit_id,
        character: c.character,
        order: c.order,
        person: {
          connect: { id: c.id },
        },
      }),
    );

  if (data.id === 507086) {
    console.log({ 'data.credits.cast': data.credits.cast });
    console.log(JSON.stringify({ castCredits }, null, 2));
  }

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
    castCredits: { create: [castCredits[0]] },
    // crewCredits: { create: crewIds },
  } as Movie;
};
