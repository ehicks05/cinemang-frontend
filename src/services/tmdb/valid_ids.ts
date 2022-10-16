import axios from 'axios';
import { format } from 'date-fns';
import { TextDecoder } from 'util';
import logger from '../logger';
import zlib from 'zlib';
import { DailyFileRow, ResourceLocationKey } from './types';
import { DAILY_FILE, RESOURCE_LOCATIONS } from './constants';

/*
 * The daily ID files contain a list of the valid IDs you can find on TMDB
 * and some higher level attributes that are helpful for filtering items
 * like the adult, video and popularity values.
 *
 * The export job runs every day and all files are available by 8:00 AM UTC.
 */

const { CONFIG, HOST, PATH, EXT, MIN_POPULARITY } = DAILY_FILE;

const getUrl = (resource: ResourceLocationKey) => {
  const filename = RESOURCE_LOCATIONS[resource].DAILY_FILE_NAME;
  const today = format(new Date(), 'MM_dd_yyyy');
  return `${HOST}${PATH}${filename}_${today}${EXT}`;
};

export const getValidIdRows = async (resource: ResourceLocationKey) => {
  const result = await axios.get(getUrl(resource), CONFIG);
  const unzipped = zlib.gunzipSync(result.data);
  const decoded = new TextDecoder().decode(unzipped);
  const rows: DailyFileRow[] = decoded
    .split('\n')
    .filter((l) => l)
    .map((line) => JSON.parse(line));
  return rows;
};

export const getValidIds = async (resource: ResourceLocationKey) => {
  try {
    const rows = await getValidIdRows(resource);
    return rows
      .filter((row) => row.popularity >= MIN_POPULARITY)
      .map((row) => row.id);
  } catch (e) {
    logger.error(e);
  }
};
