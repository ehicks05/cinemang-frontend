import { chunk, differenceBy, intersectionBy, keyBy, partition } from 'lodash';
import { formatDuration, intervalToDuration, isFirstDayOfMonth } from 'date-fns';
import { Prisma } from '@prisma/client';
import P from 'bluebird';
import { discoverMediaIds, getMovie, getTvSeries } from '../services/tmdb';
import {
  creditsToValidPersonIds,
  isEqual,
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
import { parseTvSeries } from './helpers/parse_tv_series';
import { MovieResponse, TvSeriesResponse } from '../services/tmdb/types/responses';
import { updateRelationships } from './helpers/relationships';
import { loadPersons } from './helpers/load_persons';

const OPTIONS = { concurrency: 32 };

const toId = (o: { id: number }) => o.id;

const loadMovies = async (ids: number[]) => {
  logger.info('fetching movie data');
  const remote = (await P.map(ids, getMovie, OPTIONS)).filter(
    (o): o is MovieResponse => !!o,
  );

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

    const updateResults = await P.map(toUpdate, updateOne, OPTIONS);
    const updated = updateResults.filter(o => o.result === 'ok');
    const updateErrors = updateResults.filter(o => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('movie', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      invalid: remoteInvalid.length,
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

const loadTvSeries = async (ids: number[]) => {
  logger.info('fetching tv series data');
  const remote = (await P.map(ids, getTvSeries, OPTIONS)).filter(
    (o): o is TvSeriesResponse => !!o,
  );

  const parsed = remote
    .map(parseTvSeries)
    .filter(m => m) as Prisma.TvSeriesCreateInput[];
  const parsedById = keyBy(parsed, toId);
  const [remoteValid, remoteInvalid] = partition(remote, o => parsedById[o.id]);
  const local = await prisma.tvSeries.findMany({
    where: { id: { in: ids } },
  });
  const localById = keyBy(local, toId);

  const toCreate = differenceBy(parsed, local, toId);
  const existing = intersectionBy(parsed, local, toId);
  const toUpdate = existing.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  // TODO: either rethrow, or track which movies actually made
  // it to the db, so we don't get foreign key errors later
  try {
    const createResult = await prisma.tvSeries.createMany({
      data: toCreate,
    });

    const updateOne = async (o: Prisma.TvSeriesCreateInput) => {
      try {
        await prisma.tvSeries.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    const updateResults = await P.map(toUpdate, updateOne, OPTIONS);
    const updated = updateResults.filter(o => o.result === 'ok');
    const updateErrors = updateResults.filter(o => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('tvSeries', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      invalid: remoteInvalid.length,
      created: createResult.count,
      updated: updated.length,
      unchanged: existing.length - toUpdate.length,
    });

    // create seasons and episodes here?
    // Bluebird.map(toCreate, () => {})

    const mutatedIds = [...toCreate.map(o => o.id), ...toUpdate.map(o => o.id)];
    return remoteValid
      .filter(o => mutatedIds.includes(o.id))
      .filter(o => !updateErrorsById[o.id]);
  } catch (e) {
    logger.error('error while saving', e);
  }
};

/**
 * Find all ids, chunk them, then serially for each chunk,
 * load them and then pull out the personIds and load them.
 * finally, update relationships (like credits and providers)
 */
const updateMediaByType = async (
  media: 'movie' | 'tv',
  personIdsProcessed: number[],
) => {
  const ids = await discoverMediaIds(media);
  logger.info(`found ${ids?.length} ${media} ids to load`);

  let personIdsProcessedLocal = personIdsProcessed;

  const chunks = chunk(ids, 500);
  await P.each(chunks, async (ids, i) => {
    try {
      logger.info(`processing chunk ${i + 1}/${chunks.length}`);
      logger.info(`processed ${personIdsProcessed.length} persons`);

      const loadedMedias =
        media === 'movie' ? await loadMovies(ids) : await loadTvSeries(ids);
      if (!loadedMedias || loadedMedias.length === 0) return;

      const personIds = creditsToValidPersonIds(
        loadedMedias,
        personIdsProcessedLocal,
      );
      const loadedPersonIds = await loadPersons(personIds);
      if (!loadedPersonIds || loadedPersonIds.length === 0) return;

      await updateRelationships(loadedMedias);

      personIdsProcessedLocal = personIdsProcessedLocal.concat(
        loadedPersonIds || [],
      );
    } catch (e) {
      logger.error(e);
    }
  });

  return personIdsProcessedLocal;
};

const runLoader = async (fullMode: boolean) => {
  try {
    logger.info('updating genres, languages, and watch providers...');
    await Promise.all([updateGenres(), updateLanguages(), updateWatchProviders()]);

    if (fullMode) {
      logger.info('truncating ignored_person tables');
      await prisma.ignoredPerson.deleteMany();
    }

    let personIdsProcessed: number[] = [];
    personIdsProcessed = await updateMediaByType('movie', personIdsProcessed);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    personIdsProcessed = await updateMediaByType('tv', personIdsProcessed);

    logger.info('updating counts for languages and watch providers');
    await updateLanguageCounts();
    await updateWatchProviderCounts();

    if (fullMode) {
      logger.info('cleaning up dead movies [TODO]');
    }
  } catch (err) {
    logger.error(err);
  }
};

// mostly housekeeping
const wrapper = async () => {
  try {
    logger.info('starting tmdb_loader script');
    const start = new Date();
    await prisma.systemInfo.upsert({
      create: { id: 1, loadStartedAt: start, loadFinishedAt: start },
      update: { loadStartedAt: start, loadFinishedAt: start },
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

    await runLoader(fullMode);

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

export default wrapper;
