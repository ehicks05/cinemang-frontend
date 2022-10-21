import { clear, get, set } from './services/file_cache';
import logger from './services/logger';
import { fetchDailyFile, getFilename } from './services/tmdb';
import { ResourceKey } from './services/tmdb/types';

// export const getDailyFile = async (resource: ResourceKey) => {
//   const filename = getFilename(resource);

//   logger.info('checking file cache');
//   const fromCache = await get(filename);
//   if (fromCache) {
//     logger.info('retrieving from file cache');
//     return fromCache;
//   }
//   logger.info('retrieving from tmdb');

//   const fromTmdb = await fetchDailyFile(resource);

//   // clear();
//   set(filename, fromTmdb);

//   logger.info('done');
//   return fromTmdb;
// };

// getDailyFile('MOVIE');

clear();
