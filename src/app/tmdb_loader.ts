import {
  chunk,
  difference,
  differenceBy,
  intersectionBy,
  keyBy,
  pick,
  uniq,
} from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getValidIds } from '../services/tmdb';
import {
  isEqual,
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

const options = { concurrency: 64 };

const toId = (o: { id: number }) => o.id;

const getMovie = async (id: number) =>
  prisma.movieApiResponse.findUnique({ where: { id } });
const getPerson = async (id: number) =>
  prisma.personApiResponse.findUnique({ where: { id } });

const processIdChunk = async (
  movieIds: number[],
  personIdsLoaded: number[],
) => {
  logger.info('fetching movie data');
  const remoteMovies = (
    await Promise.map(movieIds, (id) => getMovie(id), options)
  )
    .map((o) => o?.data)
    .filter((o) => o) as unknown as MovieResponse[];

  const remoteParsedMovies = remoteMovies
    .map(parseMovie)
    .filter((m) => m) as Prisma.MovieCreateInput[];
  const remoteParsedMovieIdMap = keyBy(remoteParsedMovies, toId);
  const validatedRemoteMovies = remoteMovies.filter(
    (o) => remoteParsedMovieIdMap[o.id],
  );
  const localMovies = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
  });
  const localMoviesById = keyBy(localMovies, toId);

  const moviesToCreate = differenceBy(remoteParsedMovies, localMovies, toId);
  const remoteMoviesThatExist = intersectionBy(
    remoteParsedMovies,
    localMovies,
    toId,
  );
  const moviesToUpdate = remoteMoviesThatExist.filter((o) => {
    const p = localMoviesById[o.id];
    return p && !isEqual(o, p);
  });

  // TODO: either rethrow, or track which movies actually made
  // it to the db, so we don't get foreign key errors later
  try {
    const createResult = await prisma.movie.createMany({
      data: moviesToCreate,
    });

    const updateResults = await Promise.map(moviesToUpdate, async (o) => {
      return prisma.movie.update({ where: { id: o.id }, data: o });
    });

    logger.info('movie', {
      remote: remoteMovies.length,
      unchanged: remoteMoviesThatExist.length - moviesToUpdate.length,
      created: createResult?.count,
      updated: moviesToUpdate.length,
      invalid: movieIds.length - remoteParsedMovies.length,
      failedToCreate: moviesToCreate.length - (createResult?.count || 0),
    });
  } catch (e) {
    logger.error('error while saving', e);
  }

  const unfilteredPersonIds = getPersonIds(validatedRemoteMovies);
  const personIds = difference(unfilteredPersonIds, personIdsLoaded);
  logger.info('fetching person data');
  const remotePersons = (
    await Promise.map(personIds, (id) => getPerson(id), options)
  )
    .map((o) => o?.data)
    .filter((o) => o) as unknown as PersonResponse[];
  const remoteParsedPersons = remotePersons
    .map(parsePerson)
    .filter((o) => o) as Prisma.PersonCreateInput[];

  {
    const remoteParsedPersonsById = keyBy(remoteParsedPersons, toId);
    const missing = personIds.filter((o) => !remoteParsedPersonsById[o]);
    console.log({ missing });
  }

  const localPersons = await prisma.person.findMany({
    where: { id: { in: personIds } },
  });
  const localPersonsById = keyBy(localPersons, toId);

  logger.info('determining new vs updated');
  const personsToCreate = differenceBy(remoteParsedPersons, localPersons, toId);
  const remotePersonsThatExist = intersectionBy(
    remoteParsedPersons,
    localPersons,
    toId,
  );
  const personsToUpdate = remotePersonsThatExist.filter((o) => {
    const p = localPersonsById[o.id];
    return p && !isEqual(o, p);
  });

  try {
    const createResult = await prisma.person.createMany({
      data: personsToCreate as any,
    });
    const updateResults = await Promise.map(personsToUpdate, async (o) => {
      return prisma.person.update({ where: { id: o.id }, data: o });
    });

    logger.info('person', {
      remote: remotePersons.length,
      unchanged: remotePersonsThatExist.length - personsToUpdate.length,
      created: createResult?.count,
      updated: personsToUpdate.length,
      invalid: personIds.length - remoteParsedPersons.length,
      failedToCreate: personsToCreate.length - (createResult?.count || 0),
    });

    personIdsLoaded.concat(remoteParsedPersons.map(toId));
  } catch (e) {
    logger.error('error while saving', e);
  }

  // TODO: relationship tables
  await updateRelationships(validatedRemoteMovies, remoteParsedPersons);
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

  const chunks = chunk(ids.slice(0, 10_000), 1_000);
  await Promise.each(chunks, async (ids) => {
    try {
      await processIdChunk(ids, personIdsLoaded);
    } catch (e) {
      logger.error(e);
    }
  });
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

const updateRelationships = async (
  movies: MovieResponse[],
  remoteParsedPersons: any[],
) => {
  logger.info('updating relationships...');
  // const movieIds = movies.map(o => ({movieId: o.id}));
  const movieIds = movies.map(toId);
  const personIdMap = keyBy(remoteParsedPersons, toId);

  const remoteCastCredits: Prisma.CastCreditUncheckedCreateInput[] = movies
    .map(toCastCreditCreateInput)
    .flat()
    .filter((o) => personIdMap[o.personId]);
  const localCastCredits = await prisma.castCredit.findMany({
    where: {
      movieId: { in: movieIds },
    },
  });
  const localCastCreditsById = keyBy(localCastCredits, (o) => o.creditId);

  const newCastCredits = differenceBy(
    remoteCastCredits,
    localCastCredits,
    (o) => o.creditId,
  );
  const existingCastCredits = differenceBy(
    remoteCastCredits,
    newCastCredits,
    (o) => o.creditId,
  );
  const updateCastCredits = existingCastCredits.filter((o) => {
    const p = localCastCreditsById[o.creditId];
    return p && !isEqual(o, p);
  });

  const castCreditCreateResult = await prisma.castCredit.createMany({
    data: newCastCredits,
  });

  const castCreditUpdateResults = await Promise.map(
    updateCastCredits,
    async (o) => {
      return prisma.castCredit.update({
        where: { creditId: o.creditId },
        data: o,
      });
    },
  );

  logger.info('castCredit', {
    remote: remoteCastCredits.length,
    unchanged: (existingCastCredits.length = updateCastCredits.length),
    created: castCreditCreateResult.count,
    updated: updateCastCredits.length,
    deleted: 0,
  });
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

  await updateMovies();

  // logger.info('updating counts for languages and watch providers');
  // await updateLanguageCounts();
  // await updateWatchProviderCounts();

  logger.info('finished tmdb_loader script');
};

export default updateDb;
