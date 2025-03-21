import 'dotenv/config';

import updateDbTask from './app/tmdb_loader.js';
import { argv } from './services/args.js';
import logger from './services/logger.js';
import { scheduleUpdateTask } from './tasks.js';

const init = async () => {
	if (argv.syncOnStart) {
		logger.info('--syncOnStart arg detected.');
		updateDbTask();
	}
	scheduleUpdateTask();
};

init();
