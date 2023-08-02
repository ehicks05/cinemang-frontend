import {
  chunk,
  Dictionary,
  difference,
  differenceBy,
  intersectionBy,
  keyBy,
  partition,
  pick,
  uniq,
} from 'lodash';
import {
  formatDuration,
  intervalToDuration,
  isAfter,
  isFirstDayOfMonth,
  subDays,
} from 'date-fns';
import { MovieWatchProvider, Prisma } from '@prisma/client';
import Bluebird from 'bluebird';
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
import { MovieResponse, PersonResponse } from '../services/tmdb/types/responses';
import { parsePerson } from './helpers/parse_person';

const options = { concurrency: 32 };

const toId = (o: { id: number }) => o.id;

const processMovies = async (ids: number[]) => {
  logger.info('fetching movie data');
  const remote = (await Bluebird.map(ids, getMovie, options)).filter(
    o => o,
  ) as unknown as MovieResponse[];

  const parsed = remote.map(parseMovie).filter(m => m) as Prisma.MovieCreateInput[];
  const parsedById = keyBy(parsed, toId);
  const [remoteValid, remoteInvalid] = partition(remote, o => parsedById[o.id]);
  const local = await prisma.movie.findMany({
    where: { id: { in: ids } },
  });
  const localById = keyBy(local, toId);

  const toCreate = differenceBy(parsed, local, toId);
  const existing = intersectionBy(parsed, local, toId);
  const toUpdate = existing.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  const [invalidButNew, invalidAndOld] = partition(
    remoteInvalid,
    o =>
      o.release_date && isAfter(new Date(o.release_date), subDays(new Date(), 30)),
  );
  await prisma.ignoredMovie.createMany({
    data: invalidAndOld.map(o => ({ id: o.id })),
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
    const updated = updateResults.filter(o => o.result === 'ok');
    const updateErrors = updateResults.filter(o => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('movie', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      invalid: remoteInvalid.length,
      invalidButNew: invalidButNew.length,
      invalidAndOld: invalidAndOld.length,
      created: createResult.count,
      updated: updated.length,
      unchanged: existing.length - toUpdate.length,
    });

    const mutatedIds = [...toCreate.map(o => o.id), ...toUpdate.map(o => o.id)];
    return remoteValid
      .filter(o => mutatedIds.includes(o.id))
      .filter(o => !updateErrorsById[o.id]);
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
      ...cast.map(c => c.id),
      ...crew.map(c => c.id),
    ])
    .flat();
  const deduped = uniq(personIds);
  return difference(deduped, ignoreList);
};

const toCastCreditCreateInput = (movie: MovieResponse) =>
  movie.credits.cast.map(c => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['character', 'order']),
    castId: c.cast_id,
    creditId: c.credit_id,
  }));
const toCrewCreditCreateInput = (movie: MovieResponse) =>
  movie.credits.crew.map(c => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['department', 'job']),
    creditId: c.credit_id,
  }));
const toMovieWatchProviderCreateInput = (movie: MovieResponse) => {
  const providers = movie['watch/providers'].results.US?.flatrate || [];
  return (
    providers
      // // CBS (provider_id:78) seems to be sneaking in to US results
      .filter(p => p.provider_id !== 78)
      .map(p => ({
        movieId: movie.id,
        watchProviderId: p.provider_id,
      }))
  );
};

const getExtantPersons = async (movies: MovieResponse[]) => {
  const personIdsRaw = getPersonIds(movies);
  const chunks = chunk(personIdsRaw, 10_000);

  const results = await Bluebird.map(chunks, async ids => {
    const args = {
      where: { id: { in: ids } },
      select: { id: true },
    };
    return prisma.person.findMany(args);
  });
  return results.flat().map(o => o.id);
};

const updateCastCredits = async (
  movies: MovieResponse[],
  movieIds: number[],
  personIdMap: Dictionary<number>,
) => {
  const remoteCastCredits: Prisma.CastCreditUncheckedCreateInput[] = movies
    .flatMap(toCastCreditCreateInput)
    .filter(o => personIdMap[o.personId] && o.character);
  const localCastCredits = await prisma.castCredit.findMany({
    where: {
      movieId: { in: movieIds },
    },
  });
  const localCastCreditsById = keyBy(localCastCredits, o => o.creditId);

  const newCastCredits = differenceBy(
    remoteCastCredits,
    localCastCredits,
    o => o.creditId,
  );
  const existingCastCredits = differenceBy(
    remoteCastCredits,
    newCastCredits,
    o => o.creditId,
  );
  const updateCastCredits = existingCastCredits.filter(o => {
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
    .flatMap(toCrewCreditCreateInput)
    .filter(o => personIdMap[o.personId]);
  const localCrewCredits = await prisma.crewCredit.findMany({
    where: {
      movieId: { in: movieIds },
    },
  });
  const localCrewCreditsById = keyBy(localCrewCredits, o => o.creditId);

  const newCrewCredits = differenceBy(
    remoteCrewCredits,
    localCrewCredits,
    o => o.creditId,
  );
  const existingCrewCredits = differenceBy(
    remoteCrewCredits,
    newCrewCredits,
    o => o.creditId,
  );
  const updateCrewCredits = existingCrewCredits.filter(o => {
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
      .filter(o => o && validWatchProvidersById[o.watchProviderId]);
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
  const updateMovieWatchProviders = existingMovieWatchProviders.filter(o => {
    const key = toMovieWatchProviderId(o);
    const p = localMovieWatchProvidersById[key];
    return p && !isEqual(o, p);
  });

  const movieWatchProviderCreateResult = await prisma.movieWatchProvider.createMany({
    data: newMovieWatchProviders,
  });

  const updateOne = async (o: Prisma.MovieWatchProviderUncheckedCreateInput) => {
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
    unchanged: existingMovieWatchProviders.length - updateMovieWatchProviders.length,
    created: movieWatchProviderCreateResult.count,
    updated: updateMovieWatchProviders.length,
  });
};

const updateRelationships = async (movies: MovieResponse[]) => {
  logger.info('updating relationships...');
  const movieIds = movies.map(toId);
  const personIds = await getExtantPersons(movies);
  const personIdMap = keyBy(personIds, o => o);

  await updateCastCredits(movies, movieIds, personIdMap);
  await updateCrewCredits(movies, movieIds, personIdMap);
  await updateMovieWatchProviders(movies, movieIds);
};

const processIdChunk = async (movieIds: number[], personIdsProcessed: number[]) => {
  const loadedMovies = await processMovies(movieIds);
  if (!loadedMovies || loadedMovies.length === 0) return;

  const personIds = getPersonIds(loadedMovies, personIdsProcessed);
  logger.info('fetching person data');
  const remote = (
    await Bluebird.map(personIds, id => getPerson(id), options)
  ).filter(o => o) as unknown as PersonResponse[];
  const parsed = remote
    .map(parsePerson)
    .filter(o => o) as Prisma.PersonCreateInput[];
  const parsedById = keyBy(parsed, toId);

  const local = await prisma.person.findMany({
    where: { id: { in: personIds } },
  });
  const localById = keyBy(local, toId);

  logger.info('determining new vs updated');
  const toCreate = differenceBy(parsed, local, toId);
  const remoteThatExist = intersectionBy(parsed, local, toId);
  const toUpdate = remoteThatExist.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  const [remoteValid, remoteInvalid] = partition(remote, o => parsedById[o.id]);

  await prisma.ignoredPerson.createMany({
    data: remoteInvalid.map(o => ({ id: o.id })),
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

const updateMovies = async () => {
  const ids = await getValidIds('MOVIE');
  if (!ids) {
    throw new Error('Unable to fetch ids');
  }
  const ignoredMovies = (await prisma.ignoredMovie.findMany()).map(o => o.id);
  const ignoredPersons = (await prisma.ignoredPerson.findMany()).map(o => o.id);
  const validIds = difference(ids, ignoredMovies);
  logger.info(`found ${validIds?.length} movie ids to load`);

  let personIdsProcessed = ignoredPersons;

  const chunks = chunk(validIds, 500);
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

const updateDb = async () => {
  try {
    logger.info('starting tmdb_loader script');
    const start = new Date();
    await prisma.systemInfo.update({
      data: { loadStartedAt: start, loadFinishedAt: start },
      where: { id: 1 },
    });

    if (argv.full !== 'auto') {
      logger.info('--full arg detected.');
    }

    const isStartOfMonth = isFirstDayOfMonth(new Date());
    if (isStartOfMonth) {
      logger.info('start of month detected.');
    }

    const fullMode = argv.full === 'on' || (isStartOfMonth && argv.full !== 'off');

    logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

    logger.info('updating genres, languages, and watch providers...');
    await Promise.all([updateGenres(), updateLanguages(), updateWatchProviders()]);

    if (fullMode) {
      logger.info('truncating ignored_movie and ignored_person tables');
      await Promise.all([
        prisma.ignoredMovie.deleteMany(),
        prisma.ignoredPerson.deleteMany(),
      ]);
    }
    await updateMovies();

    logger.info('updating counts for languages and watch providers');
    await updateLanguageCounts();
    await updateWatchProviderCounts();

    if (fullMode) {
      logger.info('cleaning up dead movies [TODO]');
    }

    const end = new Date();
    await prisma.systemInfo.update({
      data: { loadStartedAt: start, loadFinishedAt: end },
      where: { id: 1 },
    });
    const duration = intervalToDuration({ start, end });
    logger.info(`finished tmdb_loader script in ${formatDuration(duration)}`);
  } catch (err) {
    logger.error(err);
  }
};

export default updateDb;
