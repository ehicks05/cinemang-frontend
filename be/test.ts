import axios from 'axios';
import { range } from 'lodash-es';
import P from 'bluebird';

const statuses = new Set();

const querySeries = async (id: number) => {
  try {
    const path = `https://api.themoviedb.org/3/tv/${id}?api_key=1858e153b9857c189545dca41b1148ab`;
    const result = await axios.get(path);
    const status = result?.data?.status;
    if (!status) return;

    if (!statuses.has(status)) {
      statuses.add(status);
      console.log(status);
    }
  } catch (err) {
    // noop
  }
};

const run = async () => {
  const ids = range(0, 1024);
  await P.map(ids, querySeries, { concurrency: 5 });
};

run();
