require('dotenv').config();
import Promise from 'bluebird';
import { chunk } from 'lodash';

import logger from './services/logger';
import prisma from './services/prisma';
import { getValidIds } from './services/tmdb';

// fetch from TMDb and lightly parse it
const fetchAndParse = async (id: number) => {
  try {
    return prisma.movieApiResponse.findUnique({ where: { id: id } });
  } catch (e) {
    logger.error(e);
  }
};

const nf = Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow',
});

const processMovieApiResponseIdChunk = async (
  ids: number[],
  n: number,
  chunks: number,
) => {
  const parsed = await Promise.map(ids, async (id) => fetchAndParse(id), {
    concurrency: 64,
  });
  logger.info(parsed?.[0] || {});

  try {
    const summary = {
      heapUsed: nf.format(process.memoryUsage().heapUsed),
    };
    logger.info(`chunk ${n + 1}/${chunks}`, summary);
  } catch (e) {
    logger.error(e);
  }
};

const updateMovieApiResponses = async () => {
  const validIds = await getValidIds('MOVIE');

  const freshIds = (
    await prisma.movieApiResponse.findMany({ select: { id: true } })
  ).map((o) => o.id);

  const idsToProcess = validIds?.filter(
    (validId) => !freshIds.includes(validId),
  );

  logger.info('updateMovieApiResponses', {
    validIds: validIds?.length,
    freshIds: freshIds.length,
    idsToProcess: idsToProcess?.length,
  });

  const chunks = chunk(idsToProcess, 1000);
  await Promise.each(chunks, (ids, n) =>
    processMovieApiResponseIdChunk(ids, n, chunks.length),
  );
};

const updateDb = async () => {
  logger.info('starting raw-response-loader');

  await updateMovieApiResponses();

  logger.info('finished raw-response-loader');
};

updateDb();

export default updateDb;
