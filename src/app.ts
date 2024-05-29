import dotenv from 'dotenv';

dotenv.config();

import updateDbTask from './app/tmdb_loader';
import { scheduleUpdateTask } from './tasks';
import logger from './services/logger';
import { argv } from './services/args';

const init = async () => {
	if (argv.syncOnStart) {
		logger.info('--syncOnStart arg detected.');
		updateDbTask();
	}
	scheduleUpdateTask();
};

init();
