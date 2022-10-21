import { existsSync, mkdirSync, realpathSync } from 'fs';
import { readFile, rm, writeFile } from 'fs/promises';

const TEMP_DIR = './temp';

if (!existsSync) mkdirSync(TEMP_DIR);
console.log(realpathSync(TEMP_DIR));

export const set = async (name: string, data: any) => {
  await writeFile(`${TEMP_DIR}/${name}`, data, { flag: 'w' });
};

export const get = async (name: string) => {
  const path = `${TEMP_DIR}/${name}`;
  if (existsSync(path)) return await readFile(path);
};

export const clear = async () => {
  await rm(TEMP_DIR);
};
