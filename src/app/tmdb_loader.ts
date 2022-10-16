import { chunk } from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getValidIds, getRecentlyChangedValidIds } from '../services/tmdb';
import {
  removeDeadMovies,
  updateGenres,
  updateLanguages,
  updateWatchProviders,
} from './helpers/helpers';
import { argv } from '../services/args';
import logger from '../services/logger';
import prisma from '../services/prisma';
import {
  updateLanguageCounts,
  updateWatchProviderCounts,
} from './helpers/update_counts';
import { movieIdToParsedMovie } from './helpers/parse_movie';

const fetchParseAndLoadMovie = async (
  movieId: number,
  knownWatchProviders: number[],
) => {
  try {
    const movie = await movieIdToParsedMovie(movieId, knownWatchProviders);
    if (!movie) {
      return { loaded: 0, failed: 1 };
    }
    await prisma.movie.create({ data: movie });
    return { loaded: 1, failed: 0 };
  } catch (e) {
    logger.error(e);
    return { loaded: 0, failed: 1 };
  }
};

const processMovieIds = async (
  movieIds: number[],
  knownWatchProviders: number[],
) => {
  await prisma.movie.deleteMany({ where: { id: { in: movieIds } } });

  const result = await Promise.map(
    movieIds,
    (movieId) => fetchParseAndLoadMovie(movieId, knownWatchProviders),
    { concurrency: 64 },
  );

  const status = result.reduce(
    (agg, curr) => ({
      loaded: agg.loaded + curr.loaded,
      failed: agg.failed + curr.failed,
    }),
    { loaded: 0, failed: 0 },
  );

  logger.info(
    `chunk done: loaded: ${status.loaded}, failed: (${status.failed})`,
  );
};

const updateMovies = async (fullMode: boolean) => {
  const ids = fullMode
    ? await getValidIds('MOVIE')
    : await getRecentlyChangedValidIds('MOVIE');

  if (!ids) {
    throw new Error('Unable to fetch ids');
  }

  logger.info(`found ${ids?.length} ids to load`);

  if (fullMode) {
    await removeDeadMovies(ids);
  }

  const watchProviders = (await prisma.watchProvider.findMany())
    .map((w) => Number(w.provider_id))
    .sort((o1, o2) => o1 - o2);

  const chunks = chunk(ids, 10_000);
  await Promise.each(chunks, (ids) => processMovieIds(ids, watchProviders));
};

const updateDb = async () => {
  logger.info('starting tmdb_loader script');

  const isStartOfMonth = isFirstDayOfMonth(new Date());
  if (isStartOfMonth) {
    logger.info('start of month detected.');
  }
  if (argv.full) {
    logger.info('--full arg detected.');
  }

  const fullMode = isStartOfMonth || argv.full;

  console.log(`running ${fullMode ? 'full' : 'partial'} load`);

  console.log('updating genres, languages, and watch providers...');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);

  // await updatePeople(fullMode);
  console.log('updating movies...');
  await updateMovies(fullMode);

  console.log('updating counts for languages and watch providers');
  await updateLanguageCounts();
  await updateWatchProviderCounts();
  logger.info('finished tmdb_loader script');
};

export default updateDb;
