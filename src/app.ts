/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import updateDb from './app/tmdb_loader';
import { scheduleUpdateTask } from './tasks';
import logger from './services/logger';

const db_url = process.env.DATABASE_URL;
if (db_url) logger.info(`DB: ${db_url.slice(db_url.indexOf('@') + 1)}`);

const init = async () => {
  updateDb();
  scheduleUpdateTask();
};

init();
