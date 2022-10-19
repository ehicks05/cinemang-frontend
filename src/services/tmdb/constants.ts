import { ResponseType } from 'axios';

export const DAILY_FILE = {
  CONFIG: {
    responseType: 'arraybuffer' as ResponseType,
    maxBodyLength: 100_000_000,
  },
  HOST: 'https://files.tmdb.org',
  PATH: '/p/exports/',
  EXT: '.json.gz',
};

export const RESOURCES = {
  MOVIE: {
    DAILY_FILE_NAME: 'movie_ids',
    MIN_POPULARITY: 222.2,
    RECENTLY_CHANGED_PATH: 'movie',
  },
  PERSON: {
    DAILY_FILE_NAME: 'person_ids',
    MIN_POPULARITY: 30,
    RECENTLY_CHANGED_PATH: 'person',
  },
} as const;
