import {
  chunk,
  Dictionary,
  difference,
  differenceBy,
  intersectionBy,
  keyBy,
  pick,
  uniq,
} from 'lodash';
import {
  formatDuration,
  intervalToDuration,
  isFirstDayOfMonth,
} from 'date-fns';
import { getMovie, getPerson, getValidIds } from '../services/tmdb';
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
import {
  MovieResponse,
  PersonResponse,
} from '../services/tmdb/types/responses';
import { parsePerson } from './helpers/parse_person';
import { MovieWatchProvider, Prisma } from '@prisma/client';
import Bluebird from 'bluebird';

const options = { concurrency: 64 };

const toId = (o: { id: number }) => o.id;

// const getMovie = async (id: number) =>
//   (await prisma.movieApiResponse.findUnique({ where: { id } }))?.data;
// const getPerson = async (id: number) =>
//   (await prisma.personApiResponse.findUnique({ where: { id } }))?.data;

const processMovies = async (ids: number[]) => {
  logger.info('fetching movie data');
  const remote = (await Bluebird.map(ids, getMovie, options)).filter(
    (o) => o,
  ) as unknown as MovieResponse[];

  const parsed = remote
    .map(parseMovie)
    .filter((m) => m) as Prisma.MovieCreateInput[];
  const parsedById = keyBy(parsed, toId);
  const remoteValidated = remote.filter((o) => parsedById[o.id]);
  const local = await prisma.movie.findMany({
    where: { id: { in: ids } },
  });
  const localById = keyBy(local, toId);

  const toCreate = differenceBy(parsed, local, toId);
  const existing = intersectionBy(parsed, local, toId);
  const toUpdate = existing.filter((o) => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  // TODO: either rethrow, or track which movies actually made
  // it to the db, so we don't get foreign key errors later
  try {
    const createResult = await prisma.movie.createMany({
      data: toCreate,
    });

    const updateOne = async (o: Prisma.MovieCreateInput) => {
      try {
        await prisma.movie.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    const updateResults = await Bluebird.map(toUpdate, updateOne, options);
    const updated = updateResults.filter((o) => o.result === 'ok');
    const updateErrors = updateResults.filter((o) => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('movie', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      created: createResult.count,
      updated: updated.length,
      unchanged: existing.length - toUpdate.length,
    });

    return updateErrors.length
      ? remoteValidated.filter((o) => !updateErrorsById[o.id])
      : remoteValidated;
  } catch (e) {
    logger.error('error while saving', e);
  }
};

const processIdChunk = async (
  movieIds: number[],
  personIdsProcessed: number[],
) => {
  const loadedMovies = await processMovies(movieIds);
  if (!loadedMovies || loadedMovies.length === 0) return;

  const personIds = getPersonIds(loadedMovies, personIdsProcessed);
  logger.info('fetching person data');
  const remote = (
    await Bluebird.map(personIds, (id) => getPerson(id), options)
  ).filter((o) => o) as unknown as PersonResponse[];
  const parsed = remote
    .map(parsePerson)
    .filter((o) => o) as Prisma.PersonCreateInput[];

  const local = await prisma.person.findMany({
    where: { id: { in: personIds } },
  });
  const localById = keyBy(local, toId);

  logger.info('determining new vs updated');
  const toCreate = differenceBy(parsed, local, toId);
  const remoteThatExist = intersectionBy(parsed, local, toId);
  const toUpdate = remoteThatExist.filter((o) => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  try {
    const createResult = await prisma.person.createMany({
      data: toCreate as any,
    });

    const updateOne = async (o: Prisma.PersonCreateInput) => {
      try {
        await prisma.person.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    await Bluebird.map(toUpdate, updateOne, options);

    logger.info('person', {
      ids: personIds.length,
      fetched: remote.length,
      created: createResult?.count,
      updated: toUpdate.length,
      unchanged: remoteThatExist.length - toUpdate.length,
      invalid: personIds.length - parsed.length,
    });

    await updateRelationships(loadedMovies);

    return personIds;
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
const getPersonIds = (
  movies: WithCredits[],
  ignoreList: number[] | undefined = [],
) => {
  const personIds = movies
    .map(({ credits: { cast, crew } }) => [
      ...cast.map((c) => c.id),
      ...crew.map((c) => c.id),
    ])
    .flat();
  const deduped = uniq(personIds);
  return difference(deduped, ignoreList);
};

const updateMovies = async () => {
  const ids = await getValidIds('MOVIE');
  if (!ids) {
    throw new Error('Unable to fetch ids');
  }
  logger.info(`found ${ids?.length} movie ids to load`);

  let personIdsProcessed: number[] = [];

  // const chunks = chunk(ids.slice(0, 1_000), 1_000);
  const chunks = chunk(ids, 1_000);
  await Bluebird.each(chunks, async (ids, i) => {
    try {
      logger.info(`processing chunk ${i + 1}/${chunks.length}`);
      logger.info(`processed ${personIdsProcessed.length} persons`);
      const personIds = await processIdChunk(ids, personIdsProcessed);
      personIdsProcessed = personIdsProcessed.concat(personIds || []);
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

const getExtantPersons = async (movies: MovieResponse[]) => {
  const personIdsRaw = getPersonIds(movies);
  const chunks = chunk(personIdsRaw, 10_000);

  const results = await Bluebird.map(chunks, async (ids) => {
    const args = {
      where: { id: { in: ids } },
      select: { id: true },
    };
    return await prisma.person.findMany(args);
  });
  return results.flat().map((o) => o.id);
};

const updateCastCredits = async (
  movies: MovieResponse[],
  movieIds: number[],
  personIdMap: Dictionary<number>,
) => {
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

  try {
    const castCreditCreateResult = await prisma.castCredit.createMany({
      data: newCastCredits,
    });

    const updateOne = async (o: Prisma.CastCreditUncheckedCreateInput) => {
      try {
        const where = { creditId: o.creditId };
        prisma.castCredit.update({ where, data: o });
      } catch (e) {
        logger.error(e);
      }
    };

    await Bluebird.map(updateCastCredits, updateOne, options);

    logger.info('castCredit', {
      remote: remoteCastCredits.length,
      unchanged: existingCastCredits.length - updateCastCredits.length,
      created: castCreditCreateResult.count,
      updated: updateCastCredits.length,
    });
  } catch (e) {
    logger.error(e);
  }
};

const updateCrewCredits = async (
  movies: MovieResponse[],
  movieIds: number[],
  personIdMap: Dictionary<number>,
) => {
  const remoteCrewCredits: Prisma.CrewCreditUncheckedCreateInput[] = movies
    .map(toCrewCreditCreateInput)
    .flat()
    .filter((o) => personIdMap[o.personId]);
  const localCrewCredits = await prisma.crewCredit.findMany({
    where: {
      movieId: { in: movieIds },
    },
  });
  const localCrewCreditsById = keyBy(localCrewCredits, (o) => o.creditId);

  const newCrewCredits = differenceBy(
    remoteCrewCredits,
    localCrewCredits,
    (o) => o.creditId,
  );
  const existingCrewCredits = differenceBy(
    remoteCrewCredits,
    newCrewCredits,
    (o) => o.creditId,
  );
  const updateCrewCredits = existingCrewCredits.filter((o) => {
    const p = localCrewCreditsById[o.creditId];
    return p && !isEqual(o, p);
  });

  const crewCreditCreateResult = await prisma.crewCredit.createMany({
    data: newCrewCredits,
  });

  const updateOne = async (o: Prisma.CrewCreditUncheckedCreateInput) => {
    try {
      const where = { creditId: o.creditId };
      prisma.crewCredit.update({ where, data: o });
    } catch (e) {
      logger.error(e);
    }
  };

  await Bluebird.map(updateCrewCredits, updateOne, options);

  logger.info('crewCredit', {
    remote: remoteCrewCredits.length,
    unchanged: existingCrewCredits.length - updateCrewCredits.length,
    created: crewCreditCreateResult.count,
    updated: updateCrewCredits.length,
  });
};

const toMovieWatchProviderId = (o: MovieWatchProvider) =>
  `${o.movieId}-${o.watchProviderId}`;

const updateMovieWatchProviders = async (
  movies: MovieResponse[],
  movieIds: number[],
) => {
  const validWatchProviders = await prisma.watchProvider.findMany({
    select: { id: true },
  });
  const validWatchProvidersById = keyBy(validWatchProviders, toId);
  const remoteMovieWatchProviders: Prisma.MovieWatchProviderUncheckedCreateInput[] =
    movies
      .map(toMovieWatchProviderCreateInput)
      .flat()
      .filter((o) => o && validWatchProvidersById[o.watchProviderId]);
  const localMovieWatchProviders = await prisma.movieWatchProvider.findMany({
    where: {
      movieId: { in: movieIds },
    },
  });
  const localMovieWatchProvidersById = keyBy(
    localMovieWatchProviders,
    toMovieWatchProviderId,
  );

  const newMovieWatchProviders = differenceBy(
    remoteMovieWatchProviders,
    localMovieWatchProviders,
    toMovieWatchProviderId,
  );
  const existingMovieWatchProviders = differenceBy(
    remoteMovieWatchProviders,
    newMovieWatchProviders,
    toMovieWatchProviderId,
  );
  const updateMovieWatchProviders = existingMovieWatchProviders.filter((o) => {
    const key = toMovieWatchProviderId(o);
    const p = localMovieWatchProvidersById[key];
    return p && !isEqual(o, p);
  });

  const movieWatchProviderCreateResult =
    await prisma.movieWatchProvider.createMany({
      data: newMovieWatchProviders,
    });

  const updateOne = async (
    o: Prisma.MovieWatchProviderUncheckedCreateInput,
  ) => {
    try {
      const where = {
        movieId_watchProviderId: {
          movieId: o.movieId,
          watchProviderId: o.watchProviderId,
        },
      };
      prisma.movieWatchProvider.update({ where, data: o });
    } catch (e) {
      logger.error(e);
    }
  };

  await Bluebird.map(updateMovieWatchProviders, updateOne, options);

  logger.info('movieWatchProvider', {
    remote: remoteMovieWatchProviders.length,
    unchanged:
      existingMovieWatchProviders.length - updateMovieWatchProviders.length,
    created: movieWatchProviderCreateResult.count,
    updated: updateMovieWatchProviders.length,
  });
};

const updateRelationships = async (movies: MovieResponse[]) => {
  logger.info('updating relationships...');
  const movieIds = movies.map(toId);
  const personIds = await getExtantPersons(movies);
  const personIdMap = keyBy(personIds, (o) => o);

  await updateCastCredits(movies, movieIds, personIdMap);
  await updateCrewCredits(movies, movieIds, personIdMap);
  await updateMovieWatchProviders(movies, movieIds);
};

const updateDb = async () => {
  logger.info('starting tmdb_loader script');
  const start = new Date();

  const isStartOfMonth = isFirstDayOfMonth(new Date());
  if (isStartOfMonth) {
    logger.info('start of month detected.');
  }
  if (argv.full) {
    logger.info('--full arg detected.');
  }

  const fullMode = isStartOfMonth || argv.full;

  logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

  logger.info('updating genres, languages, and watch providers...');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);

  await updateMovies();

  logger.info('updating counts for languages and watch providers');
  await updateLanguageCounts();
  await updateWatchProviderCounts();

  logger.info('cleaning up dead movies');
  logger.info('[placeholder]');

  const duration = intervalToDuration({ start, end: new Date() });
  logger.info(`finished tmdb_loader script in ${formatDuration(duration)}`);
};

export default updateDb;
