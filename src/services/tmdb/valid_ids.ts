import axios from 'axios';
import { format, isBefore, subDays } from 'date-fns';
import { TextDecoder } from 'util';
import zlib from 'zlib';
import logger from '../logger';
import { ResourceKey } from './types';
import { DAILY_FILE, RESOURCES } from './constants';
import fileCache from '../file_cache';
import { DailyFileRow } from './types/responses';

// https://developers.themoviedb.org/3/getting-started/daily-file-exports

const { CONFIG, HOST, PATH, EXT } = DAILY_FILE;

const getFormattedDate = () => {
  const now = new Date();
  const compareTo = new Date(new Date().setUTCHours(8, 0, 0, 0));
  const daysToSub = isBefore(now, compareTo) ? 1 : 0;
  const date = subDays(new Date(), daysToSub);
  return format(date, 'MM_dd_yyyy');
  // return '11_03_2022';
};

const getFilename = (resource: ResourceKey) => {
  const filename = RESOURCES[resource].DAILY_FILE_NAME;
  const date = getFormattedDate();
  return `${filename}_${date}${EXT}`;
};

const getUrl = (resource: ResourceKey) => {
  const filename = getFilename(resource);
  return `${HOST}${PATH}${filename}`;
};

const fetchDailyFile = async (resource: ResourceKey) => {
  const result = await axios.get(getUrl(resource), CONFIG);
  const unzipped = zlib.gunzipSync(result.data);
  const decoded = new TextDecoder().decode(unzipped);
  return decoded;
};

const getDailyFile = async (resource: ResourceKey) => {
  const filename = getFilename(resource);

  logger.info('checking file cache');
  const fromCache = await fileCache.get(filename);
  if (fromCache) {
    logger.info('retrieving from file cache');
    return fromCache;
  }
  logger.info(`retrieving ${filename} from tmdb`);

  const fromTmdb = await fetchDailyFile(resource);

  await fileCache.clear(filename.slice(-15)); // don't delete files like '...CURRENT_DATE.json'
  await fileCache.set(filename, fromTmdb);

  logger.info('done');
  return fromTmdb;
};

const getValidIdRows = async (resource: ResourceKey) => {
  const dailyFile = await getDailyFile(resource);

  const rows: DailyFileRow[] = dailyFile
    .split('\n')
    .filter(l => l)
    .map(line => JSON.parse(line))
    .sort((o1, o2) => o2.popularity - o1.popularity);
  return rows;
};

export const getValidIds = async (resource: ResourceKey) => {
  try {
    return (await getValidIdRows(resource)).map(row => row.id);
  } catch (e) {
    logger.error(e);
  }
};
