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
        keys: stats.keys,
        ksize: filesize(stats.ksize),
        vsize: filesize(stats.vsize),
        vAvg: filesize(stats.vsize / stats.keys),
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
      ? await getPopularValidIds(resource)
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

const updateRelationships = async () => {
  logger.info('updating relationships...');
  const castCreateInputs: Prisma.CastCreditUncheckedCreateInput[] = cache
    .keys()
    .map((k) => cache.get(k))
    .map((v) => {
      const movie = v as MovieResponse;
      return movie.credits.cast.map((c) => ({
        movieId: movie.id,
        personId: c.id,
        ...pick(c, ['character', 'order']),
        castId: c.cast_id,
        creditId: c.credit_id,
      }));
    })
    .flat();

  // console.log({ castCreateInputs });

  const castResult = await prisma.castCredit.createMany({
    data: castCreateInputs,
  });
  logger.info(`created ${castResult.count} castCredits`);

  const crewCreateInputs: Prisma.CrewCreditUncheckedCreateInput[] = cache
    .keys()
    .map((k) => cache.get(k))
    .map((v) => {
      const movie = v as MovieResponse;
      return movie.credits.crew.map((c) => ({
        movieId: movie.id,
        personId: c.id,
        ...pick(c, ['department', 'job']),
        creditId: c.credit_id,
      }));
    })
    .flat();
  const crewResult = await prisma.crewCredit.createMany({
    data: crewCreateInputs,
  });
  logger.info(`created ${crewResult.count} crewCredits`);

  const movieWatchProviderCreateInputs: Prisma.MovieWatchProviderUncheckedCreateInput[] =
    cache
      .keys()
      .map((k) => cache.get(k))
      .map((v) => {
        const movie = v as MovieResponse;
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
      })
      .flat();

  const movieWatchProviderResult = await prisma.movieWatchProvider.createMany({
    data: movieWatchProviderCreateInputs,
  });
  logger.info(`created ${movieWatchProviderResult.count} movieWatchProviders`);
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
