import { existsSync, mkdirSync, realpathSync } from 'fs';
import { readdir, readFile, unlink, writeFile } from 'fs/promises';
import logger from './logger';

const TEMP_DIR = './file-cache';

const getPath = (file: string) => `${TEMP_DIR}/${file}`;

if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR);
logger.info('file cache: ' + realpathSync(TEMP_DIR));

const set = async (name: string, data: any) => {
  await writeFile(`${TEMP_DIR}/${name}`, data, { flag: 'w' });
};

const get = async (name: string) => {
  const path = getPath(name);
  if (existsSync(path)) return (await readFile(path)).toString();
};

const clear = async (except: string) => {
  const dir = await readdir(TEMP_DIR);
  await Promise.all(
    dir
      .filter((file) => !file.includes(except))
      .map((file) => {
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
