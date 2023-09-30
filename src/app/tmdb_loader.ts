import {
  chunk,
  differenceBy,
  intersectionBy,
  keyBy,
  partition,
  uniqBy,
} from 'lodash';
import { formatDuration, intervalToDuration, isFirstDayOfMonth } from 'date-fns';
import { Prisma } from '@prisma/client';
import P from 'bluebird';
import { discoverMediaIds, getMovie, getSeason, getShow } from '../services/tmdb';
import {
  creditsToValidPersonIds,
  isEqual,
  updateGenres,
  updateLanguages,
  updateProviders,
} from './helpers/helpers';
import { argv } from '../services/args';
import logger from '../services/logger';
import prisma from '../services/prisma';
import { updateLanguageCounts, updateProviderCounts } from './helpers/update_counts';
import { parseMovie } from './helpers/parse_movie';
import { parseShow } from './helpers/parse_show';
import { MovieResponse, ShowResponse } from '../services/tmdb/types/responses';
import { updateRelationships } from './helpers/relationships';
import { loadPersons } from './helpers/load_persons';
import { Episode, SeasonSummary } from '../services/tmdb/types/base';

const OPTIONS = { concurrency: 32 };

const toId = (o: { id: number }) => o.id;

const loadMovies = async (ids: number[]) => {
  logger.info('fetching movie data');
  const remote = (await P.map(ids, getMovie, OPTIONS)).filter(
    (o): o is MovieResponse => !!o,
  );

  const parsed = remote.map(parseMovie).filter(m => m) as Prisma.MovieCreateInput[];
  const parsedById = keyBy(parsed, toId);
  const [remoteValid, remoteInvalid] = partition(remote, o => parsedById[o.id]);
  const local = await prisma.movie.findMany({
    where: { id: { in: ids } },
  });
  const localById = keyBy(local, toId);

  const toCreate = differenceBy(parsed, local, toId);
  const existing = intersectionBy(parsed, local, toId);
  const toUpdate = existing.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  try {
    const createResult = await prisma.movie.createMany({
      data: toCreate,
    });

    const updateOne = async (o: Prisma.MovieCreateInput) => {
      try {
        await prisma.movie.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    const updateResults = await P.map(toUpdate, updateOne, OPTIONS);
    const updated = updateResults.filter(o => o.result === 'ok');
    const updateErrors = updateResults.filter(o => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('movie', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      invalid: remoteInvalid.length,
      created: createResult.count,
      updated: updated.length,
      unchanged: existing.length - toUpdate.length,
    });

    const mutatedIds = [...toCreate.map(o => o.id), ...toUpdate.map(o => o.id)];
    return remoteValid
      .filter(o => mutatedIds.includes(o.id))
      .filter(o => !updateErrorsById[o.id]);
  } catch (e) {
    logger.error('error while saving', e);
  }
};

const loadShows = async (ids: number[]) => {
  logger.info('fetching show data');
  const remote = (await P.map(ids, getShow, OPTIONS)).filter(
    (o): o is ShowResponse => !!o,
  );

  const parsed = remote.map(parseShow).filter(m => m) as Prisma.ShowCreateInput[];
  const parsedById = keyBy(parsed, toId);
  const [remoteValid, remoteInvalid] = partition(remote, o => parsedById[o.id]);
  const local = await prisma.show.findMany({
    where: { id: { in: ids } },
  });
  const localById = keyBy(local, toId);

  const toCreate = differenceBy(parsed, local, toId);
  const existing = intersectionBy(parsed, local, toId);
  const toUpdate = existing.filter(o => {
    const p = localById[o.id];
    return p && !isEqual(o, p);
  });

  try {
    const createResult = await prisma.show.createMany({
      data: toCreate,
    });

    const updateOne = async (o: Prisma.ShowCreateInput) => {
      try {
        await prisma.show.update({ where: { id: o.id }, data: o });
        return { result: 'ok', id: o.id };
      } catch (e) {
        logger.error(e);
        return { result: 'error', id: o.id };
      }
    };

    const updateResults = await P.map(toUpdate, updateOne, OPTIONS);
    const updated = updateResults.filter(o => o.result === 'ok');
    const updateErrors = updateResults.filter(o => o.result === 'error');
    const updateErrorsById = keyBy(updateErrors, toId);

    logger.info('shows', {
      ids: ids.length,
      fetched: remote.length,
      validated: parsed.length,
      invalid: remoteInvalid.length,
      created: createResult.count,
      updated: updated.length,
      unchanged: existing.length - toUpdate.length,
    });

    const mutatedIds = [...toCreate.map(o => o.id), ...toUpdate.map(o => o.id)];
    const mutated = remoteValid
      .filter(o => mutatedIds.includes(o.id))
      .filter(o => !updateErrorsById[o.id]);

    const seasons = await prisma.season.findMany({
      where: { showId: { in: mutatedIds } },
    });
    await prisma.episode.deleteMany({
      where: { seasonId: { in: seasons.map(s => s.id) } },
    });
    await prisma.season.deleteMany({ where: { showId: { in: mutatedIds } } });

    const toSeasonCreateInput = (o: SeasonSummary & { showId: number }) => ({
      id: o.id,
      showId: o.showId,
      airDate: o.air_date ? new Date(o.air_date) : undefined,
      episodeCount: o.episode_count,
      name: o.name,
      overview: o.overview,
      posterPath: o.poster_path,
      seasonNumber: o.season_number,
      voteAverage: o.vote_average,
    });

    const seasonCreateInputs = mutated
      .flatMap(show => show.seasons.map(season => ({ ...season, showId: show.id })))
      .map(toSeasonCreateInput);

    // create
    await prisma.season.createMany({ data: seasonCreateInputs });
    await P.map(
      seasonCreateInputs,
      async ({ showId, seasonNumber }) => {
        const season = await getSeason(showId, seasonNumber);
        if (!season) {
          return;
        }

        // fold season credits into show credits
        const show = mutated.find(o => o.id === showId);
        if (show) {
          show.credits.cast = uniqBy(
            [...show.credits.cast, ...season.credits.cast],
            toId,
          );
          show.credits.crew = uniqBy(
            [...show.credits.crew, ...season.credits.crew],
            toId,
          );
        }

        const toEpisodeCreateInput = (
          o: Episode & { seasonId: number; showId: number },
        ) => ({
          id: o.id,
          seasonId: o.seasonId,
          showId: o.showId,
          airDate: o.air_date ? new Date(o.air_date) : undefined,
          episodeNumber: o.episode_number,
          name: o.name,
          overview: o.overview,
          runtime: o.runtime,
        });

        const episodeCreateInputs = season.episodes.map(episode =>
          toEpisodeCreateInput({ ...episode, seasonId: season.id, showId }),
        );
        await prisma.episode.createMany({ data: episodeCreateInputs });
      },
      OPTIONS,
    );

    return mutated;
  } catch (e) {
    logger.error('error while saving', e);
  }
};

/**
 * 1. Find all ids and chunk them,
 * 2. For each chunk (serially)
 *    - load them, then extract and load personIds from the medias
 *    - update relationships (like credits and providers)
 */
const updateMediaByType = async (
  media: 'movie' | 'tv',
  personIdsProcessed: number[],
) => {
  const ids = await discoverMediaIds(media);
  logger.info(`found ${ids?.length} ${media} ids to load`);

  let personIdsProcessedLocal = personIdsProcessed;

  const chunks = chunk(ids, 500);
  await P.each(chunks, async (ids, i) => {
    try {
      logger.info(`processing chunk ${i + 1}/${chunks.length}`);

      const loadedMedias =
        media === 'movie' ? await loadMovies(ids) : await loadShows(ids);
      if (!loadedMedias || loadedMedias.length === 0) return;

      const personIds = creditsToValidPersonIds(
        loadedMedias,
        personIdsProcessedLocal,
      );
      const loadedPersonIds = await loadPersons(personIds);
      if (!loadedPersonIds || loadedPersonIds.length === 0) return;

      await updateRelationships(loadedMedias);

      personIdsProcessedLocal = personIdsProcessedLocal.concat(
        loadedPersonIds || [],
      );
    } catch (e) {
      logger.error(e);
    }
  });

  return personIdsProcessedLocal;
};

const runLoader = async (fullMode: boolean) => {
  try {
    logger.info('updating genres, languages, and watch providers...');
    await Promise.all([updateGenres(), updateLanguages(), updateProviders()]);

    if (fullMode) {
      logger.info('TODO: determine special behavior (if any) for full mode');
    }

    let personIdsProcessed: number[] = [];
    personIdsProcessed = await updateMediaByType('movie', personIdsProcessed);
    personIdsProcessed = await updateMediaByType('tv', personIdsProcessed);

    logger.debug(`processed ${personIdsProcessed.length} personIds`);
    logger.info('updating counts for languages and watch providers');
    await updateLanguageCounts();
    await updateProviderCounts();

    if (fullMode) {
      logger.info('cleaning up dead movies [TODO]');
    }
  } catch (err) {
    logger.error(err);
  }
};

// mostly housekeeping
const wrapper = async () => {
  try {
    logger.info('starting tmdb_loader script');
    const { id: logId } = await prisma.syncRunLog.create({ data: {} });

    if (argv.full !== 'auto') {
      logger.info('--full arg detected.');
    }

    const isStartOfMonth = isFirstDayOfMonth(new Date());
    if (isStartOfMonth) {
      logger.info('start of month detected.');
    }

    const fullMode = argv.full === 'on' || (isStartOfMonth && argv.full !== 'off');

    logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

    await runLoader(fullMode);

    const log = await prisma.syncRunLog.update({
      data: { endedAt: new Date() },
      where: { id: logId },
    });
    const duration = intervalToDuration({ start: log.createdAt, end: log.endedAt! });
    logger.info(`finished tmdb_loader script in ${formatDuration(duration)}`);
  } catch (err) {
    logger.error(err);
  }
};

export default wrapper;
