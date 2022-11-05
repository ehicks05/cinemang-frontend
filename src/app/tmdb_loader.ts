import {
  chunk,
  difference,
  differenceBy,
  intersectionBy,
  isEqual,
  isNil,
  omitBy,
  pick,
  uniq,
} from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getValidIds } from '../services/tmdb';
import {
  removeInvalidMovies,
  updateGenres,
  updateLanguages,
  updateWatchProviders,
} from './helpers/helpers';
import { argv } from '../services/args';
import logger from '../services/logger';
import prisma from '../services/prisma';
import {
  updateLanguageCounts,
  updateWatchProviderCounts,
} from './helpers/update_counts';
import { parseMovie } from './helpers/parse_movie';
import { MovieResponse, PersonResponse } from '../services/tmdb/types';
import { parsePerson } from './helpers/parse_person';
import { Prisma } from '@prisma/client';
import cacheMan from '../services/cache';

const toId = (o: { id: number }) => o.id;

const getMovie = async (id: number) =>
  prisma.movieApiResponse.findUnique({ where: { id } });
const getPerson = async (id: number) =>
  prisma.personApiResponse.findUnique({ where: { id } });

const processIdChunk = async (
  movieIds: number[],
  personIdsLoaded: number[],
) => {
  logger.info('fetching remote movie data');
  const remoteMovies = (
    await Promise.map(movieIds, (id) => getMovie(id), {
      concurrency: 64,
    })
  )
    .map((o) => o?.data)
    .filter((o) => o) as unknown as MovieResponse[];

  const remoteParsedMovies = remoteMovies
    .map(parseMovie)
    .filter((m) => m) as Prisma.MovieCreateInput[];

  logger.info('fetching local movie data');
  const localMovies = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
  });
  logger.info('identifying new vs updated');
  const moviesToCreate = differenceBy(remoteParsedMovies, localMovies, toId);
  const remoteMoviesThatExist = intersectionBy(
    remoteParsedMovies,
    localMovies,
    toId,
  );
  const moviesToUpdate = remoteMoviesThatExist.filter((o) => {
    const partner = localMovies.find((m) => m.id === o.id);
    const a = omitBy(o, isNil);
    const b = omitBy(partner, isNil);
    return !isEqual(a, b);
  });
  if (moviesToUpdate.length > 0) {
    console.log({
      movieToUpdate: moviesToUpdate[0],
      localVersion: localMovies.find((o) => o.id === moviesToUpdate[0].id),
    });
  }

  logger.info('identifying peopleIds');
  const unfilteredPersonIds = getPersonIds(remoteMovies);
  const personIds = difference(unfilteredPersonIds, personIdsLoaded);
  logger.info('fetching remote person data');
  const remotePersons = (
    await Promise.map(personIds, (id) => getPerson(id), {
      concurrency: 64,
    })
  )
    .map((o) => o?.data)
    .filter((o) => o) as unknown as PersonResponse[];
  const remoteParsedPersons = remotePersons
    .map(parsePerson)
    .filter((o) => o) as Prisma.PersonCreateInput[];

  logger.info('fetching local person data');
  const localPersons = await prisma.person.findMany({
    where: { id: { in: personIds } },
  });

  logger.info('determining new vs updated');
  const personsToCreate = differenceBy(remoteParsedPersons, localPersons, toId);
  const remotePersonsThatExist = intersectionBy(
    remoteParsedPersons,
    localPersons,
    toId,
  );
  const personsToUpdate = remotePersonsThatExist.filter((o) => {
    const partner = localPersons.find((m) => m.id === o.id);
    const a = omitBy(o, isNil);
    const b = omitBy(partner, isNil);
    return !isEqual(a, b);
  });
  if (personsToUpdate.length > 0) {
    console.log({
      personToUpdate: omitBy(personsToUpdate[0], isNil),
      localVersion: omitBy(
        localPersons.find((o) => o.id === personsToUpdate[0].id),
        isNil,
      ),
    });
  }

  try {
    const createMoviesResult = await prisma.movie.createMany({
      data: moviesToCreate,
    });
    logger.info('movie creation', {
      created: createMoviesResult?.count,
      existingButUnchanged:
        remoteMoviesThatExist.length - moviesToUpdate.length,
      updated: moviesToUpdate.length,
      invalid: movieIds.length - moviesToCreate.length,
      failed: moviesToCreate.length - (createMoviesResult?.count || 0),
    });
    const createPersonsResult = await prisma.person.createMany({
      data: personsToCreate as any,
    });
    logger.info('person creation', {
      created: createPersonsResult?.count,
      existingButUnchanged:
        remotePersonsThatExist.length - personsToUpdate.length,
      updated: personsToUpdate.length,
      invalid: personIds.length - personsToCreate.length,
      failed: personsToCreate.length - (createPersonsResult?.count || 0),
    });

    logger.info('updating movies');
    const updateMoviesResults = await Promise.map(moviesToUpdate, async (o) => {
      return prisma.movie.update({ where: { id: o.id }, data: o });
    });
    logger.info('updating persons');
    const updatePersonsResults = await Promise.map(
      personsToUpdate,
      async (o) => {
        return prisma.person.update({ where: { id: o.id }, data: o });
      },
    );

    personIdsLoaded.concat(personIds);
  } catch (e) {
    logger.error('error while saving', e);
  }
};

interface WithCredits {
  credits: {
    cast: { id: number }[];
    crew: { id: number }[];
  };
}
const getPersonIds = (movies: WithCredits[]) => {
  const personIds = movies
    .map(({ credits: { cast, crew } }) => [
      ...cast.map((c) => c.id),
      ...crew.map((c) => c.id),
    ])
    .flat();
  return uniq(personIds);
};

const updateMovies = async () => {
  const ids = await getValidIds('MOVIE');
  if (!ids) {
    throw new Error('Unable to fetch ids');
  }
  logger.info(`found ${ids?.length} movie ids to load`);

  const personIdsLoaded: number[] = [];

  const chunks = chunk(ids.slice(0, 100), 1_000);
  await Promise.each(chunks, (ids) => processIdChunk(ids, personIdsLoaded));
};

const toCastCreditCreateInput = (movie: MovieResponse) => {
  return movie.credits.cast.map((c) => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['character', 'order']),
    castId: c.cast_id,
    creditId: c.credit_id,
  }));
};
const toCrewCreditCreateInput = (movie: MovieResponse) => {
  return movie.credits.crew.map((c) => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['department', 'job']),
    creditId: c.credit_id,
  }));
};
const toMovieWatchProviderCreateInput = (movie: MovieResponse) => {
  const providers = movie['watch/providers'].results.US?.flatrate || [];
  return (
    providers
      // // CBS (provider_id:78) seems to be sneaking in to US results
      .filter((p) => p.provider_id !== 78)
      .map((p) => ({
        movieId: movie.id,
        watchProviderId: p.provider_id,
      }))
  );
};

const updateRelationships = async () => {
  logger.info('updating relationships...');

  const movieCache = cacheMan.get('MOVIE');
  const keyChunks = chunk(movieCache.keys(), 10_000);

  let count = 0;
  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.CastCreditUncheckedCreateInput[] = keyChunk
      .map((k) => movieCache.get(k))
      .map((v) => toCastCreditCreateInput(v as MovieResponse))
      .flat();

    const result = await prisma.castCredit.createMany({ data });
    count += result.count;
  });

  logger.info(`created ${count} castCredits`);
  count = 0;

  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.CrewCreditUncheckedCreateInput[] = keyChunk
      .map((k) => movieCache.get(k))
      .map((v) => toCrewCreditCreateInput(v as MovieResponse))
      .flat();

    const result = await prisma.crewCredit.createMany({ data });
    count += result.count;
  });

  logger.info(`created ${count} crewCredits`);
  count = 0;

  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.MovieWatchProviderUncheckedCreateInput[] = keyChunk
      .map((k) => movieCache.get(k))
      .map((v) => toMovieWatchProviderCreateInput(v as MovieResponse))
      .flat();

    const result = await prisma.movieWatchProvider.createMany({ data });
    count += result.count;
  });

  logger.info(`created ${count} movieWatchProviders`);
  count = 0;
};

const updateDb = async () => {
  logger.info('starting tmdb_loader script');

  const isStartOfMonth = isFirstDayOfMonth(new Date());
  if (isStartOfMonth) {
    logger.info('start of month detected.');
  }
  if (argv.full) {
    logger.info('--full arg detected.');
  }

  const fullMode = isStartOfMonth || argv.full;

  logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

  // logger.info('updating genres, languages, and watch providers...');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);

  // await updateMovies();

  // logger.info('updating counts for languages and watch providers');
  // await updateLanguageCounts();
  // await updateWatchProviderCounts();

  logger.info('finished tmdb_loader script');
};

export default updateDb;
