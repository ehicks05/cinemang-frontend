import { ResponseType } from 'axios';

export const DAILY_FILE = {
  CONFIG: {
    responseType: 'arraybuffer' as ResponseType,
    maxBodyLength: 100_000_000,
  },
  HOST: 'https://files.tmdb.org',
  PATH: '/p/exports/',
  EXT: '.json.gz',
  MIN_POPULARITY: 2.2,
};

export const RESOURCE_LOCATIONS = {
  MOVIE: {
    DAILY_FILE_NAME: 'movie_ids',
    RECENTLY_CHANGED_PATH: 'movie',
  },
  PERSON: {
    DAILY_FILE_NAME: 'person_ids',
    RECENTLY_CHANGED_PATH: 'person',
  },
} as const;
