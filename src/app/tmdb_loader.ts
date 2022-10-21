import { chunk } from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getPopularValidIds } from '../services/tmdb';
import {
  removeInvalidMovies,
  removeInvalidPeople,
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
import { ResourceKey } from '../services/tmdb/types';
import { idToParsedPerson } from './helpers/parse_person';
import { getRecentlyChangedValidIds } from '../services/tmdb/recent_changes';

const fetchParseAndLoad = async (
  id: number,
  resource: ResourceKey,
  knownWatchProviders: number[],
) => {
  try {
    const data =
      resource === 'MOVIE'
        ? await idToParsedMovie(id, knownWatchProviders)
        : await idToParsedPerson(id);

    if (!data) {
      return { loaded: 0, failed: 1 };
    }

    try {
      if ('title' in data) {
        await prisma.movie.create({ data });
      }
      if ('name' in data) {
        await prisma.person.create({ data });
      }
    } catch (e) {
      logger.error('failed to save', data);
      throw e;
    }
    return { loaded: 1, failed: 0 };
  } catch (e) {
    logger.error(e);
    return { loaded: 0, failed: 1 };
  }
};

const processIdChunk = async (
  ids: number[],
  resource: ResourceKey,
  knownWatchProviders: number[],
) => {
  if (resource === 'MOVIE') {
    await prisma.movie.deleteMany({ where: { id: { in: ids } } });
  }
  if (resource === 'PERSON') {
    await prisma.person.deleteMany({ where: { id: { in: ids } } });
  }

  const result = await Promise.map(
    ids,
    (id) => fetchParseAndLoad(id, resource, knownWatchProviders),
    { concurrency: 4 },
  );

  const status = result.reduce(
    (agg, curr) => ({
      loaded: agg.loaded + curr.loaded,
      failed: agg.failed + curr.failed,
    }),
    { loaded: 0, failed: 0 },
  );

  logger.info(`  loaded: ${status.loaded}, failed: (${status.failed})`);
};

const updateResource = async (resource: ResourceKey, fullMode: boolean) => {
  const ids = fullMode
    ? await getPopularValidIds(resource)
    : await getRecentlyChangedValidIds(resource);

  if (!ids) {
    throw new Error('Unable to fetch ids');
  }

  logger.info(`found ${ids?.length} ids to load`);

  // todo: this could be a top level process at the end of the script?
  if (fullMode) {
    if (resource === 'MOVIE') await removeInvalidMovies(ids);
    if (resource === 'PERSON') await removeInvalidPeople(ids);
  }

  const watchProviders = (await prisma.watchProvider.findMany())
    .map((w) => Number(w.id))
    .sort((o1, o2) => o1 - o2);

  const chunks = chunk(ids, 100);
  await Promise.each(chunks, (ids) =>
    processIdChunk(ids, resource, watchProviders),
  );
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

  // logger.info('updating people...');
  // await updateResource('PERSON', fullMode);

  logger.info('updating movies...');
  await updateResource('MOVIE', fullMode);

  logger.info('updating counts for languages and watch providers');
  await updateLanguageCounts();
  await updateWatchProviderCounts();
  logger.info('finished tmdb_loader script');
};

export default updateDb;
