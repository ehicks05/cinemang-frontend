import _ from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import { getDailyFileIds, getRecentlyChangedMovieIds } from '../services/tmdb';
import {
  updateGenres,
  updateLanguages,
  updateWatchProviders,
} from './helpers/helpers';
import logger from '../services/logger';
import prisma from '../services/prisma';
import { updateLanguageCounts } from './helpers/update_language_counts';
import { movieIdToParsedMovie } from './helpers/parse_movie';
import { argv } from '../services/args';

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
  await prisma.movie.deleteMany({ where: { tmdbId: { in: movieIds } } });

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

const updateMovies = async () => {
  const isStartOfMonth = isFirstDayOfMonth(new Date());
  logger.info(
    isStartOfMonth
      ? `start of month detected. defaulting to full load.`
      : 'not start of month. defaulting to partial load.',
  );
  if (argv.full) {
    logger.info(
      '--full arg detected: overriding defaults and running a full load.',
    );
  }

  const fullMode = isStartOfMonth || argv.full;

  const movieIds = fullMode
    ? await getDailyFileIds()
    : await getRecentlyChangedMovieIds();

  logger.info(
    `${fullMode ? 'daily file' : 'changes endpoint'} returned ${
      movieIds?.length
    } movie ids`,
  );

  if (fullMode) {
    logger.info('running in full mode. deleting dead movies before loading.');

    const existingIds = (
      await prisma.movie.findMany({ select: { tmdbId: true } })
    ).map((m) => m.tmdbId);
    const deadIds = existingIds.filter((e) => !movieIds?.includes(e));
    logger.info(`identified ${deadIds.length} dead movies`);

    const { count } = await prisma.movie.deleteMany({
      where: { tmdbId: { in: deadIds } },
    });
    logger.info(`finished deleting ${count} dead movies`);
  }

  const watchProviders = (await prisma.watchProvider.findMany())
    .map((w) => Number(w.provider_id))
    .sort((o1, o2) => o1 - o2);

  const chunks = _.chunk(movieIds, 10_000);
  await Promise.each(chunks, (movieIds) =>
    processMovieIds(movieIds, watchProviders),
  );
};

const updateDb = async () => {
  logger.info('starting tmdb_loader script');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);

  await updateMovies();

  await updateLanguageCounts();
  logger.info('finished tmdb_loader script');
};

export default updateDb;
