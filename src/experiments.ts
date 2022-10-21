import fileCache from './services/file_cache';
import logger from './services/logger';
import { fetchDailyFile, getFilename } from './services/tmdb';
import { ResourceKey } from './services/tmdb/types';

export const getDailyFile = async (resource: ResourceKey) => {
  const filename = getFilename(resource);

  logger.info('checking file cache');
  const fromCache = await fileCache.get(filename);
  if (fromCache) {
    logger.info('retrieving from file cache');
    return fromCache;
  }
  logger.info('retrieving from tmdb');

  const fromTmdb = await fetchDailyFile(resource);

  await fileCache.set(filename, fromTmdb);

  logger.info('done');
  return fromTmdb;
};

const main = async () => {
  const file = await getDailyFile('MOVIE');
  logger.info(file.split('\n')[0]);
};

main();
