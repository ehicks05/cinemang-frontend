import { filesize } from 'filesize';
import NodeCache from 'node-cache';
import logger from './logger';

const caches: Record<string, NodeCache> = {};

const create = (name: string) => {
  caches[name] = new NodeCache();
};
const get = (name: string) => caches[name];

const log = (name: string) => {
  const stats = caches[name].getStats();
  logger.info({
    cache: {
      n: stats.keys,
      ksize: filesize(stats.ksize, { round: 0 }),
      vsize: filesize(stats.vsize, { round: 0 }),
      vAvg: filesize(stats.vsize / stats.keys || 1, { round: 0 }),
    },
  });
};

const cache = {
  caches,
  create,
  get,
  log,
};

export default cache;
