require('dotenv').config();
import Promise from 'bluebird';
import { subWeeks } from 'date-fns';
import { chunk, keyBy, pick } from 'lodash';

import logger from './services/logger';
import prisma from './services/prisma';
import { getValidIds, getMovie, getPerson } from './services/tmdb';

const nf = Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow',
});

const fetchMovie = async (id: number) => {
  try {
    const data = await getMovie(id);
    if (!data) return undefined;

    return { id, data };
  } catch (e) {
    logger.error(e);
  }
};

const processMovieApiResponseIdChunk = async (
  ids: number[],
  n: number,
  chunks: number,
) => {
  const movies = await Promise.map(ids, async (id) => fetchMovie(id), {
    concurrency: 64,
  });

  try {
    const data = movies.filter((r) => r && r.data);
    const createResult = await prisma.movieApiResponse.createMany({
      data: data as any,
    });
    const mem = pick(process.memoryUsage(), ['rss', 'heapTotal', 'heapUsed']);
    const summary = {
      loaded: createResult.count,
      notLoaded: ids.length - createResult.count,
      rss: nf.format(mem.rss),
      heapTotal: nf.format(mem.heapTotal),
      heapUsed: nf.format(mem.heapUsed),
    };
    logger.info(`chunk ${n + 1}/${chunks}`, summary);
  } catch (e) {
    logger.error(e);
  }
};

const updateMovieApiResponses = async () => {
  const validIds = await getValidIds('MOVIE');

  // delete stale
  const staleDeletionResult = await prisma.movieApiResponse.deleteMany({
    where: { updatedAt: { lt: subWeeks(new Date(), 1) } },
  });
  const freshIds = (
    await prisma.movieApiResponse.findMany({ select: { id: true } })
  ).map((o) => o.id);
  const freshIdMap = keyBy(freshIds, (o) => o);

  const idsToProcess = validIds?.filter((validId) => !freshIdMap[validId]);

  logger.info('updateMovieApiResponses', {
    validIds: validIds?.length,
    staleDeletionResult: staleDeletionResult.count,
    freshIds: freshIds.length,
    idsToProcess: idsToProcess?.length,
  });

  const chunks = chunk(idsToProcess, 1000);
  await Promise.each(chunks, (ids, n) =>
    processMovieApiResponseIdChunk(ids, n, chunks.length),
  );
};

const fetchPerson = async (id: number) => {
  try {
    const data = await getPerson(id);
    if (!data) return undefined;

    return { id, data };
  } catch (e) {
    logger.error(e);
  }
};

const processPersonApiResponseIdChunk = async (
  ids: number[],
  n: number,
  chunks: number,
) => {
  const parsed = await Promise.map(ids, async (id) => fetchPerson(id), {
    concurrency: 64,
  });

  try {
    const data = parsed.filter((r) => r && r.data);
    const createResult = await prisma.personApiResponse.createMany({
      data: data as any,
    });
    const mem = pick(process.memoryUsage(), ['rss', 'heapTotal', 'heapUsed']);
    const summary = {
      loaded: createResult.count,
      notLoaded: ids.length - createResult.count,
      rss: nf.format(mem.rss),
      heapTotal: nf.format(mem.heapTotal),
      heapUsed: nf.format(mem.heapUsed),
    };
    logger.info(`chunk ${n + 1}/${chunks}`, summary);
  } catch (e) {
    logger.error(e);
  }
};

const updatePersonApiResponses = async () => {
  const validIds = await getValidIds('PERSON');

  // delete stale
  const staleDeletionResult = await prisma.personApiResponse.deleteMany({
    where: { updatedAt: { lt: subWeeks(new Date(), 1) } },
  });
  const freshIds = (
    await prisma.personApiResponse.findMany({ select: { id: true } })
  ).map((o) => o.id);
  const freshIdMap = keyBy(freshIds, (o) => o);

  const idsToProcess = validIds?.filter((validId) => !freshIdMap[validId]);

  logger.info('updatePersonApiResponses', {
    validIds: validIds?.length,
    staleDeletionResult: staleDeletionResult.count,
    freshIds: freshIds.length,
    idsToProcess: idsToProcess?.length,
  });

  const chunks = chunk(idsToProcess, 10_000);
  await Promise.each(chunks, (ids, n) =>
    processPersonApiResponseIdChunk(ids, n, chunks.length),
  );
};

const updateDb = async () => {
  logger.info('starting raw-response-loader');

  await updateMovieApiResponses();
  await updatePersonApiResponses();

  logger.info('finished raw-response-loader');
};

updateDb();

export default updateDb;
