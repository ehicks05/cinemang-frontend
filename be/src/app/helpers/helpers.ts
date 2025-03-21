import type { Prisma } from '@prisma/client';
import P from 'bluebird';
import { isEqual as _isEqual, chunk, keyBy, omit, uniq } from 'lodash-es';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { getGenres, getLanguages, getProviders } from '~/services/tmdb/index.js';
import type { MediaResponse } from '~/services/tmdb/types/responses.js';

export const updateGenres = async () => {
	update({
		model: 'genre',
		fetcher: getGenres,
	});
};

export const updateLanguages = async () =>
	update({
		model: 'language',
		fetcher: getLanguages,
		remoteMapper: (o) => ({
			id: o.iso_639_1,
			name: o.english_name,
		}),
	});

export const updateProviders = async () =>
	update({
		model: 'provider',
		fetcher: getProviders,
		remoteMapper: (o) => ({
			displayPriority: o.display_priorities.US,
			id: o.provider_id,
			logoPath: o.logo_path,
			name: o.provider_name,
		}),
	});

/**
 * Determine if two records are the same, ignoring nullish fields in either record.
 * Also ignores `popularity` and `count` fields, and `vote_count` if the difference
 * is <= 10% of the smaller value
 */
export const isEqual = (a: Record<string, any>, b: Record<string, any>) => {
	// consider vote_count unequal only once
	// the difference is over 10%
	const aCount = a.vote_count || a.voteCount;
	const bCount = b.vote_count || a.voteCount;
	const diff = Math.abs(aCount - bCount);
	const min = Math.min(aCount, bCount);
	const omitVoteCount = diff / min > 0.1 ? ['vote_count'] : [];

	// TODO: omitting 'count' is hacky
	const omittedFields = ['popularity', 'count', ...omitVoteCount];
	return _isEqual(omit(a, omittedFields), omit(b, omittedFields));
};

interface Params {
	fetcher: () => Promise<any>;
	remoteMapper?: (o: any) => { id: number | string };
	model: Uncapitalize<Prisma.ModelName>;
	deleteOrphans?: boolean;
	idField?: string;
}

export const update = async ({
	fetcher,
	remoteMapper,
	model,
	deleteOrphans = false,
	idField = 'id',
}: Params) => {
	const client: any = prisma[model];
	const toId = (o: any) => o[idField];
	const remoteRecordsRaw: any[] = await fetcher();
	const remoteRecords = remoteMapper
		? remoteRecordsRaw.map(remoteMapper)
		: remoteRecordsRaw;
	const remoteIdMap = keyBy(remoteRecords.map(toId), (o) => o);
	const localRecords: any[] = await client.findMany();
	const localRecordMap = keyBy(localRecords, (o) => o[idField]);

	const changes = {
		remote: remoteRecords.length,
		unchanged: 0,
		created: 0,
		updated: 0,
		deleted: 0,
	};

	const toBeUpdated = remoteRecords.filter((o) => {
		const pair = localRecordMap[o[idField]];
		return pair && !isEqual(o, pair);
	});
	changes.unchanged = localRecords.length - toBeUpdated.length;

	if (toBeUpdated.length > 0) {
		await P.map(toBeUpdated, async (o) => {
			const args = {
				where: { id: o[idField] },
				data: o,
			};
			return client.update(args);
		});
		changes.updated = toBeUpdated.length;
	}

	const toBeAdded = remoteRecords.filter((o) => !localRecordMap[o[idField]]);
	if (toBeAdded.length > 0) {
		const result = await client.createMany({ data: toBeAdded });
		changes.created = result.count;
	}

	const toBeDeleted = localRecords.filter((o) => !remoteIdMap[o[idField]]);
	if (deleteOrphans && toBeDeleted.length > 0) {
		const where = { id: { in: toBeDeleted.map(toId) } };
		const result = await client.deleteMany({ where });
		changes.deleted = result.count;
	}

	logger.info('updated', model, changes);
};

// TODO: chunk and process the validIds instead of fetching all ids
export const removeInvalidMovies = async (validIds: number[]) => {
	logger.info(`Removing records in the db that aren't in the valid ids file.`);
	const existingIds = (await prisma.movie.findMany({ select: { id: true } })).map(
		(m) => m.id,
	);
	const invalidIds = existingIds.filter((e) => !validIds?.includes(e));
	const chunks = chunk(invalidIds, 10_000);
	await P.each(chunks, (ids) =>
		prisma.movie.deleteMany({
			where: { id: { in: ids } },
		}),
	);
	logger.info(`removed ${invalidIds.length} invalid records`);
};

export const mediasToPersonIds = (media: MediaResponse[]) => {
	const personIds = media
		.flatMap(({ credits: { cast, crew } }) => [...cast, ...crew])
		.filter((credit) => credit.profile_path)
		.map((credit) => credit.id);
	const deduped = uniq(personIds);
	return deduped;
};

/**
 * Takes a list of medias, maps its credits to personIds, then returns
 * the subset of ids that are also in the db.
 */
export const getExistingPersonIds = async (medias: MediaResponse[]) => {
	const personIds = mediasToPersonIds(medias);
	const chunks = chunk(personIds, 10_000);

	const results = await P.map(chunks, async (ids) => {
		const args = {
			where: { id: { in: ids } },
			select: { id: true },
		};
		return prisma.person.findMany(args);
	});
	return results.flat().map((o) => o.id);
};
