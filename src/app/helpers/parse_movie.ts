import { Prisma } from '@prisma/client';
import { pick, uniq } from 'lodash';
import prisma from '../../services/prisma';
import { getMovie } from '../../services/tmdb';
import { RESOURCES } from '../../services/tmdb/constants';
import { Credit, MovieResponse, ResourceKey } from '../../services/tmdb/types';
import { idToParsedPerson } from './parse_person';

export const isValidMovie = (
  movie: MovieResponse,
  director?: string,
  cast?: string,
) => {
  return !!(
    !movie.adult &&
    movie.credits &&
    movie.genres[0] &&
    movie.poster_path &&
    movie.release_date &&
    movie.releases &&
    movie.runtime &&
    movie.vote_count >= 3 &&
    director?.length &&
    cast?.length
  );
};

export const isValidCredit = (credit: Credit, resource: ResourceKey) => {
  return (
    !credit.adult && credit.popularity >= RESOURCES[resource].MIN_POPULARITY
  );
};

export const idToParsedMovie = async (
  id: number,
  knownWatchProviders: number[],
) => {
  const data = await getMovie(id);
  if (!data) return undefined;

  const director: string | undefined = data.credits.crew.find(
    (c) => c.job === 'Director',
  )?.name;
  const cast = data.credits.cast
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ');

  // ignore movies missing required data
  if (!isValidMovie(data, director, cast)) {
    return undefined;
  }

  const certification = data.releases.countries.find(
    (r) => r.iso_3166_1 === 'US' && r.certification,
  )?.certification;
  const genreId = data.genres[0].id;

  // cbs (provider_id:78) seems to be sneaking in to US results
  // so filter out providers that aren't in the watch_provider table
  const watchProviders = (data['watch/providers'].results.US?.flatrate || [])
    .filter((wp) => knownWatchProviders.includes(wp.provider_id))
    .map((provider) => ({
      watchProvider: { connect: { id: provider.provider_id } },
    }));

  const castCredits = data.credits.cast
    .filter((c) => isValidCredit(c, 'PERSON'))
    .map((c) => ({
      ...pick(c, ['character', 'order']),
      castId: c.cast_id,
      creditId: c.credit_id,
      person: {
        connect: { id: c.id },
      },
    }));
  const crewCredits = data.credits.crew
    .filter((c) => isValidCredit(c, 'PERSON'))
    .map((c) => ({
      ...pick(c, ['department', 'job']),
      creditId: c.credit_id,
      person: {
        connect: { id: c.id },
      },
    }));

  const peopleIdsInMovie = [...castCredits, ...crewCredits].map(
    (c) => c.person.connect.id,
  );
  const peopleIdsInDb = (
    await prisma.person.findMany({
      where: {
        id: {
          in: peopleIdsInMovie,
        },
      },
      select: { id: true },
    })
  ).map((p) => p.id);

  const peopleIdsToAdd = uniq(
    peopleIdsInMovie.filter((p) => !peopleIdsInDb.includes(p)),
  );

  const peopleData = (
    await Promise.all(peopleIdsToAdd.map((p) => idToParsedPerson(p)))
  ).filter((p): p is Prisma.PersonCreateInput => !!p);

  // await prisma.person.createMany({
  //   data: peopleData,
  // });

  await Promise.all(
    peopleData.map((p) =>
      prisma.person.upsert({
        where: { id: p.id },
        create: p,
        update: p,
      }),
    ),
  );

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
    watchProviders: { create: watchProviders },
    castCredits: { create: castCredits },
    crewCredits: { create: crewCredits },
  };
  return create;
};
