import { scheduleJob } from 'node-schedule';
import updateDb from './app/tmdb_loader';

export function scheduleUpdateTask() {
  return scheduleJob('0 10 * * *', async () => {
    await updateDb();
  });
}
