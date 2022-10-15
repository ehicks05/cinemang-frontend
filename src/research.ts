import _ from 'lodash';
import { getValidIdRows } from './services/tmdb';
import { DailyFileRow } from './services/tmdb/types';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const findItemsWithMinPopularity = (
  popularity: number,
  rows: DailyFileRow[],
) => {
  const filtered = rows
    .filter((row) => row.popularity >= popularity)
    .sort((o1, o2) => o1.popularity - o2.popularity);
  const lowestItem = filtered[0] || { original_title: 'N/A' };
  const lowestItemName =
    'original_title' in lowestItem
      ? lowestItem.original_title
      : lowestItem.name;

  return {
    popularity: nf.format(popularity),
    count: filtered.length,
    sample: lowestItemName,
  };
};

const analysePopularity = async () => {
  console.log('fetching daily id files');
  const [movieRows, personRows] = await Promise.all([
    getValidIdRows('movie_ids'),
    getValidIdRows('person_ids'),
  ]);

  console.log('crunching numbers');

  const movieResults = [
    ..._.range(0, 10, 0.2).map((popularity) =>
      findItemsWithMinPopularity(popularity, movieRows),
    ),
    ..._.range(10, 100, 20).map((popularity) =>
      findItemsWithMinPopularity(popularity, movieRows),
    ),
    ..._.range(100, 1000, 200).map((popularity) =>
      findItemsWithMinPopularity(popularity, movieRows),
    ),
  ];
  console.log('MOVIE POPULARITY');
  console.table(movieResults);

  const personResults = [
    ..._.range(0, 10, 0.2).map((popularity) =>
      findItemsWithMinPopularity(popularity, personRows),
    ),
    ..._.range(10, 100, 20).map((popularity) =>
      findItemsWithMinPopularity(popularity, personRows),
    ),
    ..._.range(100, 1000, 200).map((popularity) =>
      findItemsWithMinPopularity(popularity, personRows),
    ),
  ];
  console.log('\nPERSON POPULARITY');
  console.table(personResults);
};

analysePopularity();
