import { scheduleJob } from 'node-schedule';
import updateDbTask from './app/tmdb_loader.js';

export function scheduleUpdateTask() {
	return scheduleJob('0 10 * * *', async () => {
		await updateDbTask();
	});
}
