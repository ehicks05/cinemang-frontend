import { scheduleJob } from 'node-schedule';
import updateDb from './tmdb_api';

export function scheduleUpdateMovies() {
  return scheduleJob('0 10 * * *', async function () {
    await updateDb();
  });
}
