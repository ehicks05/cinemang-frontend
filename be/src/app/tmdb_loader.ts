import type { Prisma } from '@prisma/client';
import P from 'bluebird';
import { formatDuration, intervalToDuration, isFirstDayOfMonth } from 'date-fns';
import {
	chunk,
	difference,
	differenceBy,
	intersectionBy,
	keyBy,
	partition,
	uniqBy,
} from 'lodash-es';
import { PRISMA_OPTIONS } from '~/constants.js';
import { argv } from '~/services/args.js';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { TMDB_OPTIONS } from '~/services/tmdb/constants.js';
import {
	discoverMediaIds,
	getMovie,
	getSeason,
	getShow,
} from '~/services/tmdb/index.js';
import type { SeasonSummary } from '~/services/tmdb/types/base.js';
import type {
	MovieResponse,
	ShowResponse,
} from '~/services/tmdb/types/responses.js';
import {
	isEqual,
	mediasToPersonIds,
	updateGenres,
	updateLanguages,
	updateProviders,
} from './helpers/helpers.js';
import { createPersons, updatePersons } from './helpers/load_persons.js';
import { parseMovie } from './helpers/parse_movie.js';
import { parseShow } from './helpers/parse_show.js';
import { updateRelationships } from './helpers/relationships.js';
import {
	updateLanguageCounts,
	updateProviderCounts,
} from './helpers/update_counts.js';

const toId = (o: { id: number }) => o.id;
const toCreditId = (o: { credit_id: string }) => o.credit_id;

const loadMovies = async (ids: number[]) => {
	logger.info('fetching movie data');
	const remote = (await P.map(ids, getMovie, TMDB_OPTIONS)).filter(
		(o): o is MovieResponse => !!o,
	);

	const parsed = remote
		.map(parseMovie)
		.filter((m) => m) as Prisma.MovieCreateInput[];
	const parsedById = keyBy(parsed, toId);
	const [remoteValid, remoteInvalid] = partition(remote, (o) => parsedById[o.id]);
	const local = await prisma.movie.findMany({
		where: { id: { in: ids } },
	});
	const localById = keyBy(local, toId);

	const toCreate = differenceBy(parsed, local, toId);
	const existing = intersectionBy(parsed, local, toId);
	const toUpdate = existing.filter((o) => {
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

		const updateResults = await P.map(toUpdate, updateOne, PRISMA_OPTIONS);
		const updated = updateResults.filter((o) => o.result === 'ok');
		const updateErrors = updateResults.filter((o) => o.result === 'error');
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

		const mutatedIds = [...toCreate.map((o) => o.id), ...toUpdate.map((o) => o.id)];
		return remoteValid
			.filter((o) => mutatedIds.includes(o.id))
			.filter((o) => !updateErrorsById[o.id]);
	} catch (e) {
		logger.error('error while saving', e);
	}
};

const loadShows = async (ids: number[]) => {
	logger.info('fetching show data');
	const remote = (await P.map(ids, getShow, TMDB_OPTIONS)).filter(
		(o): o is ShowResponse => !!o,
	);

	const parsed = remote.map(parseShow).filter((m) => m) as Prisma.ShowCreateInput[];
	const parsedById = keyBy(parsed, toId);
	const [remoteValid, remoteInvalid] = partition(remote, (o) => parsedById[o.id]);
	const local = await prisma.show.findMany({
		where: { id: { in: ids } },
	});
	const localById = keyBy(local, toId);

	const toCreate = differenceBy(parsed, local, toId);
	const existing = intersectionBy(parsed, local, toId);
	const toUpdate = existing.filter((o) => {
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

		const updateResults = await P.map(toUpdate, updateOne, PRISMA_OPTIONS);
		const updated = updateResults.filter((o) => o.result === 'ok');
		const updateErrors = updateResults.filter((o) => o.result === 'error');
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

		const mutatedIds = [...toCreate.map((o) => o.id), ...toUpdate.map((o) => o.id)];
		const mutated = remoteValid
			.filter((o) => mutatedIds.includes(o.id))
			.filter((o) => !updateErrorsById[o.id]);

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
			.flatMap((show) =>
				show.seasons
					.filter((season) => season.season_number !== 0)
					.map((season) => ({ ...season, showId: show.id })),
			)
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
				// todo: consider using the /tv/:id/aggregate_credits endpoint for this
				const show = mutated.find((o) => o.id === showId);
				if (show) {
					show.credits.cast = uniqBy(
						[...show.credits.cast, ...season.credits.cast],
						toCreditId,
					);
					show.credits.crew = uniqBy(
						[...show.credits.crew, ...season.credits.crew],
						toCreditId,
					);
				}
			},
			TMDB_OPTIONS,
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
	personIdsInDb: number[],
	isFullMode: boolean,
) => {
	const ids = await discoverMediaIds(media, isFullMode);
	logger.info(`found ${ids?.length} ${media} ids to load`);

	let personIdsInDbLocal = personIdsInDb;

	const chunks = chunk(ids, 500);
	await P.each(chunks, async (ids, i) => {
		try {
			logger.info(`processing chunk ${i + 1}/${chunks.length}`);

			const loadedMedias =
				media === 'movie' ? await loadMovies(ids) : await loadShows(ids);
			if (!loadedMedias || loadedMedias.length === 0) return;

			// personIds extracted from media credits
			const personIds = mediasToPersonIds(loadedMedias);

			// remove existing personIds
			const newPersonIds = difference(personIds, personIdsInDbLocal);

			const createdPersonIds = await createPersons(newPersonIds);

			await updateRelationships(loadedMedias);

			personIdsInDbLocal = personIdsInDbLocal.concat(createdPersonIds || []);
		} catch (e) {
			logger.error(e);
		}
	});

	return personIdsInDbLocal;
};

const runLoader = async (fullMode: boolean) => {
	try {
		logger.info('updating genres, languages, and providers...');
		await Promise.all([updateGenres(), updateLanguages(), updateProviders()]);

		if (fullMode) {
			logger.info('TODO: determine special behavior (if any) for full mode');
		}

		let personIdsInDb = (await prisma.person.findMany({ select: { id: true } })).map(
			(o) => o.id,
		);
		personIdsInDb = await updateMediaByType('movie', personIdsInDb, fullMode);
		personIdsInDb = await updateMediaByType('tv', personIdsInDb, fullMode);

		await updatePersons();

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

const reportDbLatency = async () => {
	// warm
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	// measure
	const start = Date.now();
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	const end = Date.now();
	const dur = (end - start) / 3;
	logger.info(`test query 'select 1' took ${dur} ms`);
};

// mostly housekeeping
const wrapper = async () => {
	try {
		await reportDbLatency();

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
		const duration = intervalToDuration({
			start: log.createdAt,
			end: log.endedAt || 0,
		});
		logger.info(`finished tmdb_loader script in ${formatDuration(duration)}`);
	} catch (err) {
		logger.error(err);
	}
};

export default wrapper;
