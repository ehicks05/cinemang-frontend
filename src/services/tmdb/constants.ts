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

const RESOURCES_WITH_RECENT_CHANGES = {
  MOVIE: {
    DAILY_FILE_NAME: 'movie_ids',
    RECENTLY_CHANGED_PATH: 'movie',
  },
  TV_SERIES: {
    DAILY_FILE_NAME: 'tv_series_ids',
    RECENTLY_CHANGED_PATH: 'tv',
  },
  PERSON: {
    DAILY_FILE_NAME: 'person_ids',
    RECENTLY_CHANGED_PATH: 'person',
  },
};

export const RESOURCES = {
  ...RESOURCES_WITH_RECENT_CHANGES,
  COLLECTION: {
    DAILY_FILE_NAME: 'collection_ids',
  },
  TV_NETWORK: {
    DAILY_FILE_NAME: 'tv_network_ids',
  },
  COMPANY: {
    DAILY_FILE_NAME: 'production_company_ids',
  },
} as const;

export type RecentChangeCompatibleResource =
  keyof typeof RESOURCES_WITH_RECENT_CHANGES;
