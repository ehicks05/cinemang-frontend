import dotenv from 'dotenv';

dotenv.config();

import updateDbTask from './app/tmdb_loader';
import { argv } from './services/args';
import logger from './services/logger';
import { scheduleUpdateTask } from './tasks';

const init = async () => {
	if (argv.syncOnStart) {
		logger.info('--syncOnStart arg detected.');
		updateDbTask();
	}
	scheduleUpdateTask();
};

init();
