import axios from 'axios';
import { format, subDays } from 'date-fns';
import { TextDecoder } from 'util';
import logger from '../logger';
import zlib from 'zlib';
import { DailyFileRow } from './types';

const host = 'https://files.tmdb.org';
const path = '/p/exports/';
const filenameBase = 'movie_ids_';
const ext = '.json.gz';
const getFilename = () =>
  `${filenameBase}${format(subDays(new Date(), 1), 'MM_dd_yyyy')}${ext}`;

/**
 * The daily files contain a list of the valid IDs you can find on TMDB
 * and some higher level attributes that are helpful for filtering items
 * like the adult, video and popularity values.
 *
 * All of the exported files are available for download from http://files.tmdb.org.
 * The export job runs every day starting at around 7:00 AM UTC, and all files are
 * available by 8:00 AM UTC.
 */
export const getDailyFile = async (): Promise<DailyFileRow[]> => {
  const url = `${host}${path}${getFilename()}`;

  const result = await axios.get(url, {
    responseType: 'arraybuffer',
    maxBodyLength: 100_000_000,
  });
  const unzipped = zlib.gunzipSync(result.data);
  const decoded = new TextDecoder().decode(unzipped);
  return decoded
    .split('\n')
    .filter((l) => l)
    .map((line) => JSON.parse(line));
};

export const getDailyFileIds = async () => {
  try {
    const file = await getDailyFile();
    file.map((line) => line.id);
  } catch (e) {
    logger.error(e);
  }
};
