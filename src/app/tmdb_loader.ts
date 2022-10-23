import { chunk, pick, uniq } from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getPopularValidIds } from '../services/tmdb';
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
import { idToParsedMovie } from './helpers/parse_movie';
import { MovieResponse, ResourceKey } from '../services/tmdb/types';
import { idToParsedPerson } from './helpers/parse_person';
import { getRecentlyChangedValidIds } from '../services/tmdb/recent_changes';
import { Prisma } from '@prisma/client';
import cache from '../services/cache';
import { filesize } from 'filesize';

const fetchAndParse = async (id: number, resource: ResourceKey) => {
  try {
    return resource === 'MOVIE'
      ? await idToParsedMovie(id)
      : await idToParsedPerson(id);
  } catch (e) {
    logger.error(e);
  }
};

const processIdChunk = async (ids: number[], resource: ResourceKey) => {
  if (resource === 'MOVIE') {
    await prisma.movie.deleteMany({ where: { id: { in: ids } } });
  }
  if (resource === 'PERSON') {
    await prisma.person.deleteMany({ where: { id: { in: ids } } });
  }

  const parsed = await Promise.map(ids, (id) => fetchAndParse(id, resource), {
    concurrency: 64,
  });

  let createResult;
  try {
    if (resource === 'MOVIE') {
      const data = parsed.filter((r): r is Prisma.MovieCreateInput => !!r);
      createResult = await prisma.movie.createMany({ data });
    }
    if (resource === 'PERSON') {
      const data = parsed.filter((r): r is Prisma.PersonCreateInput => !!r);
      createResult = await prisma.person.createMany({ data });
    }
  } catch (e) {
    logger.error('error while saving');
  }

  logger.info(
    `  loaded: ${createResult?.count}, failed: (${
      ids.length - (createResult?.count || 0)
    })`,
  );
  if (resource === 'MOVIE') {
    const stats = cache.getStats();
    logger.info({
      cache: {
        n: stats.keys,
        ksize: filesize(stats.ksize, { round: 0 }),
        vsize: filesize(stats.vsize, { round: 0 }),
        vAvg: filesize(stats.vsize / stats.keys, { round: 0 }),
      },
    });
  }
};

const getPersonIds = () => {
  const personIds = uniq(
    cache
      .keys()
      .map((k) => cache.get(k))
      .map((v) => {
        const movie = v as MovieResponse;

        return uniq([
          ...movie.credits.cast.map((c) => c.id),
          ...movie.credits.crew.map((c) => c.id),
        ]);
      })
      .flat(),
  );
  return personIds;
};

const updateResource = async (resource: ResourceKey, fullMode: boolean) => {
  const ids =
    resource === 'PERSON'
      ? getPersonIds()
      : fullMode
      ? (await getPopularValidIds(resource))?.slice(0, 100)
      : // :  [629];
        await getRecentlyChangedValidIds(resource);

  if (!ids) {
    throw new Error('Unable to fetch ids');
  }

  logger.info(`found ${ids?.length} ${resource.toLowerCase()} ids to load`);

  // todo: this could be a top level process at the end of the script?
  if (fullMode && resource === 'MOVIE') {
    await removeInvalidMovies(ids);
  }

  const chunks = chunk(ids, 10_000);
  await Promise.each(chunks, (ids) => processIdChunk(ids, resource));
};

const movieToCastCredits = (movie: MovieResponse) => {
  return movie.credits.cast.map((c) => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['character', 'order']),
    castId: c.cast_id,
    creditId: c.credit_id,
  }));
};
const movieToCrewCredits = (movie: MovieResponse) => {
  return movie.credits.crew.map((c) => ({
    movieId: movie.id,
    personId: c.id,
    ...pick(c, ['department', 'job']),
    creditId: c.credit_id,
  }));
};
const movieToMovieWatchProviders = (movie: MovieResponse) => {
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

  const keyChunks = chunk(cache.keys(), 10_000);

  let count = 0;
  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.CastCreditUncheckedCreateInput[] = keyChunk
      .map((k) => cache.get(k))
      .map((v) => movieToCastCredits(v as MovieResponse))
      .flat();

    const result = await prisma.castCredit.createMany({ data });
    count += result.count;
  });

  logger.info(`created ${count} castCredits`);
  count = 0;

  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.CrewCreditUncheckedCreateInput[] = keyChunk
      .map((k) => cache.get(k))
      .map((v) => movieToCrewCredits(v as MovieResponse))
      .flat();

    const result = await prisma.crewCredit.createMany({ data });
    count += result.count;
  });

  logger.info(`created ${count} crewCredits`);
  count = 0;

  await Promise.each(keyChunks, async (keyChunk) => {
    const data: Prisma.MovieWatchProviderUncheckedCreateInput[] = keyChunk
      .map((k) => cache.get(k))
      .map((v) => movieToMovieWatchProviders(v as MovieResponse))
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

  logger.info('updating genres, languages, and watch providers...');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);

  await updateResource('MOVIE', fullMode);
  await updateResource('PERSON', fullMode);
  await updateRelationships();

  logger.info('updating counts for languages and watch providers');
  await updateLanguageCounts();
  await updateWatchProviderCounts();

  logger.info('finished tmdb_loader script');
};

export default updateDb;
