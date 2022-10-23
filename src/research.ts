import _, { merge } from 'lodash';
import logger from './services/logger';
import { getValidIdRows } from './services/tmdb';
import { DailyFileRow } from './services/tmdb/types';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const nfInt = Intl.NumberFormat('en-US');

// dataset rows must be pre-sorted
const findItemsWithMinPopularity = (
  popularity: number,
  datasets: { rows: DailyFileRow[]; label: string }[],
) => {
  const results = datasets.map((dataset) => {
    const filtered = dataset.rows.filter((row) => row.popularity >= popularity);
    const lowestItem = filtered[0] || { original_title: 'N/A' };
    const lowestItemName =
      'original_title' in lowestItem
        ? lowestItem.original_title
        : lowestItem.name;

    return {
      [`${dataset.label} count`]: nfInt.format(filtered.length),
      [`${dataset.label} sample`]: lowestItemName.slice(0, 28),
    };
  });

  const result = merge({}, ...results);

  return {
    popularity: nf.format(popularity),
    ...result,
  };
};

const analysePopularity = async () => {
  logger.info('fetching daily id files');
  const [movieRows, personRows] = await Promise.all([
    getValidIdRows('MOVIE'),
    getValidIdRows('PERSON'),
  ]);

  logger.info('crunching numbers');

  const datasets = [
    {
      rows: movieRows.sort((o1, o2) => o1.popularity - o2.popularity),
      label: 'movie',
    },
    {
      rows: personRows.sort((o1, o2) => o1.popularity - o2.popularity),
      label: 'person',
    },
  ];

  const results = [
    ..._.range(0, 10, 0.2).map((popularity) =>
      findItemsWithMinPopularity(popularity, datasets),
    ),
    ..._.range(10, 100, 20).map((popularity) =>
      findItemsWithMinPopularity(popularity, datasets),
    ),
    ..._.range(100, 5000, 200).map((popularity) =>
      findItemsWithMinPopularity(popularity, datasets),
    ),
  ];
  logger.info('MOVIE POPULARITY');
  console.table(results);
};

analysePopularity();
