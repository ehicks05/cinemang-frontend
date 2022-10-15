import axios from 'axios';
import { format } from 'date-fns';
import { TextDecoder } from 'util';
import logger from '../logger';
import zlib from 'zlib';
import { DailyFileCategory, DailyFileRow } from './types';
import { DAILY_FILE } from './constants';

/*
 * The daily ID files contain a list of the valid IDs you can find on TMDB
 * and some higher level attributes that are helpful for filtering items
 * like the adult, video and popularity values.
 *
 * The export job runs every day and all files are available by 8:00 AM UTC.
 */

const { CONFIG, HOST, PATH, EXT, MIN_POPULARITY } = DAILY_FILE;

const getUrl = (category: DailyFileCategory) => {
  const today = format(new Date(), 'MM_dd_yyyy');
  return `${HOST}${PATH}${category}_${today}${EXT}`;
};

export const getValidIdRows = async (category: DailyFileCategory) => {
  const result = await axios.get(getUrl(category), CONFIG);
  const unzipped = zlib.gunzipSync(result.data);
  const decoded = new TextDecoder().decode(unzipped);
  const rows: DailyFileRow[] = decoded
    .split('\n')
    .filter((l) => l)
    .map((line) => JSON.parse(line));
  return rows;
};

export const getValidIds = async (category: DailyFileCategory) => {
  try {
    const rows = await getValidIdRows(category);
    return rows
      .filter((row) => row.popularity >= MIN_POPULARITY)
      .map((row) => row.id);
  } catch (e) {
    logger.error(e);
  }
};
