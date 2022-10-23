require('dotenv').config();
import updateDb from './app/tmdb_loader';
import { scheduleUpdateTask } from './tasks';
import logger from './services/logger';
import cache from './services/cache';

const db_url = process.env.DATABASE_URL;
if (db_url) logger.info(`DB: ${db_url.slice(db_url.indexOf('@') + 1)}`);

const init = async () => {
  cache.create('MOVIE');
  cache.create('PERSON');

  updateDb();
  scheduleUpdateTask();
};

init();
