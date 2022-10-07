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

const updateMovies = async (knownWatchProviders: number[]) => {
  const isStartOfMonth = isFirstDayOfMonth(new Date());
  const movieIds = isStartOfMonth
    ? await getDailyFileIds()
    : await getRecentlyChangedMovieIds();

  logger.info(
    `${isStartOfMonth ? 'daily file' : 'changes endpoint'} returned ${
      movieIds?.length
    } movie ids`,
  );

  if (isStartOfMonth) {
    logger.info(
      'start of month detected. deleting dead movies before loading.',
    );
    const deadMovies = await prisma.movie.count({
      where: { tmdbId: { notIn: movieIds } },
    });
    logger.info(`${deadMovies} detected. deleting...`);
    await prisma.movie.deleteMany({ where: { tmdbId: { notIn: movieIds } } });
    logger.info(`finished deleting dead movies`);
  }

  const chunks = _.chunk(movieIds, 10_000);
  await Promise.each(chunks, (movieIds) =>
    processMovieIds(movieIds, knownWatchProviders),
  );
};

const updateDb = async () => {
  logger.info('starting daily refresh');
  await Promise.all([
    updateGenres(),
    updateLanguages(),
    updateWatchProviders(),
  ]);
  const watchProviders = (await prisma.watchProvider.findMany())
    .map((w) => Number(w.provider_id))
    .sort((o1, o2) => o1 - o2);
  await updateMovies(watchProviders);

  await updateLanguageCounts();
  logger.info('finished daily refresh');
};

export default updateDb;
