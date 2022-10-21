import { existsSync, mkdirSync, realpathSync } from 'fs';
import { readdir, readFile, rm, unlink, writeFile } from 'fs/promises';
import logger from './logger';

const TEMP_DIR = './temp';

const getPath = (file: string) => `${TEMP_DIR}/${file}`;

if (!existsSync) mkdirSync(TEMP_DIR);
logger.info('file cache: ' + realpathSync(TEMP_DIR));

const set = async (name: string, data: any) => {
  await writeFile(`${TEMP_DIR}/${name}`, data, { flag: 'w' });
};

const get = async (name: string) => {
  const path = getPath(name);
  if (existsSync(path)) return (await readFile(path)).toString();
};

const clear = async () => {
  const dir = await readdir(TEMP_DIR);
  await Promise.all(
    dir.map((file) => {
      logger.info('cleaning up file cache: ' + realpathSync(getPath(file)));
      unlink(realpathSync(getPath(file)));
    }),
  );
};

const fileCache = {
  clear,
  get,
  set,
  TEMP_DIR,
};

export default fileCache;
