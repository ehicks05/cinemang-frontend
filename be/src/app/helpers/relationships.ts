import type { Prisma } from '@prisma/client';
import P from 'bluebird';
import { differenceBy, keyBy } from 'lodash';
import { PRISMA_OPTIONS } from '~/constants.js';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import type { MediaResponse } from '~/services/tmdb/types/responses.js';
import { getExistingPersonIds, isEqual } from './helpers.js';

const toId = (o: { id: number }) => o.id;

const toCreditCreateInput = (media: MediaResponse) =>
	[...media.credits.cast, ...media.credits.crew].map((c) => ({
		...mediaToRelationshipKey(media),
		personId: c.id,
		creditId: c.credit_id,
		...('character' in c && {
			character: c.character,
			order: c.order,
		}),
		...('job' in c && {
			department: c.department,
			job: c.job,
		}),
	}));

const mediaToRelationshipKey = (media: MediaResponse) => {
	if ('title' in media) return { movieId: media.id };
	if ('name' in media) return { showId: media.id };
	throw new Error('unrecognized media object');
};

const mediaToWhereClauseKey = (media: MediaResponse) => {
	if ('title' in media) return 'movieId';
	if ('name' in media) return 'showId';
	throw new Error('unrecognized media object');
};

const toCreditId = (o: { creditId: string }) => o.creditId;

const loadCredits = async (medias: MediaResponse[], mediaIds: number[]) => {
	const personIds = await getExistingPersonIds(medias);
	const personIdMap = keyBy(personIds, (o) => o);

	const remoteCredits: Prisma.CreditUncheckedCreateInput[] = medias
		.flatMap(toCreditCreateInput)
		.filter((o) => personIdMap[o.personId]);
	const whereClauseKey = mediaToWhereClauseKey(medias[0]);
	const localCredits = await prisma.credit.findMany({
		where: { [whereClauseKey]: { in: mediaIds } },
	});
	const localCreditsById = keyBy(localCredits, (o) => o.creditId);

	const creditsToCreate = differenceBy(remoteCredits, localCredits, toCreditId);
	const existingCredits = differenceBy(remoteCredits, creditsToCreate, toCreditId);
	const creditsToUpdate = existingCredits.filter((o) => {
		const p = localCreditsById[o.creditId];
		if (!p) return false;

		// add potentially missing fields to remote object for equality check
		o.showId = o.showId || null;
		o.movieId = o.movieId || null;

		o.character = o.character || null;
		o.order = o.order === undefined ? null : o.order;

		o.department = o.department || null;
		o.job = o.job || null;

		return !isEqual(o, p);
	});

	const creditsToDelete = differenceBy(localCredits, remoteCredits, toCreditId);

	try {
		const creditCreateResult = await prisma.credit.createMany({
			data: creditsToCreate,
		});
		const creditDeleteResult = await prisma.credit.deleteMany({
			where: { creditId: { in: creditsToDelete.map((o) => o.creditId) } },
		});

		const updateOne = async (o: Prisma.CreditUncheckedCreateInput) => {
			try {
				const where = { creditId: o.creditId };
				await prisma.credit.update({ where, data: o });
			} catch (e) {
				logger.error(e);
			}
		};

		await P.map(creditsToUpdate, updateOne, PRISMA_OPTIONS);

		logger.info('credit', {
			remote: remoteCredits.length,
			unchanged: existingCredits.length - creditsToUpdate.length,
			created: creditCreateResult.count,
			deleted: creditDeleteResult.count,
			updated: creditsToUpdate.length,
		});
	} catch (e) {
		logger.error(e);
	}
};

const toComparisonId = (o: {
	movieId?: number | null;
	showId?: number | null;
	providerId: number;
}) => `${o.movieId || o.showId}-${o.providerId}`;

const getProvidersById = async () => {
	const providers = await prisma.provider.findMany({
		select: { id: true },
	});
	return keyBy(providers, toId);
};

const toMediaProviderCreateInput = (media: MediaResponse) => {
	const providers = media['watch/providers'].results.US?.flatrate || [];
	return (
		providers
			// // CBS (provider_id:78) seems to be sneaking in to US results
			.filter((p) => p.provider_id !== 78)
			.map((p) => ({
				...mediaToRelationshipKey(media),
				providerId: p.provider_id,
			}))
	);
};

const loadProviders = async (medias: MediaResponse[], mediaIds: number[]) => {
	const providersById = await getProvidersById();
	const remoteMediaProviders: Prisma.MediaProviderUncheckedCreateInput[] = medias
		.flatMap(toMediaProviderCreateInput)
		.filter((o) => o && providersById[o.providerId]);

	const whereClauseKey = mediaToWhereClauseKey(medias[0]);
	const localMediaProviders = await prisma.mediaProvider.findMany({
		where: {
			[whereClauseKey]: { in: mediaIds },
		},
	});
	const localMediaProvidersById = keyBy(localMediaProviders, toComparisonId);

	const newMediaProviders = differenceBy(
		remoteMediaProviders,
		localMediaProviders,
		toComparisonId,
	);
	const existingMediaProviders = differenceBy(
		remoteMediaProviders,
		newMediaProviders,
		toComparisonId,
	);
	const mediaProvidersToUpdate = existingMediaProviders.filter((o) => {
		const key = toComparisonId(o);

		// add potentially missing fields to remote object for equality check
		o.showId = o.showId || null;
		o.movieId = o.movieId || null;

		// remove the id field we only store locally
		const { id, ...p } = localMediaProvidersById[key];

		return p && !isEqual(o, p);
	});

	const mediaProviderCreateResult = await prisma.mediaProvider.createMany({
		data: newMediaProviders,
	});

	const updateOne = async (o: Prisma.MediaProviderUncheckedUpdateInput) => {
		const id = localMediaProviders.find(
			(local) =>
				local.movieId === o.movieId &&
				local.showId === o.showId &&
				local.providerId === o.providerId,
		)?.id;
		try {
			const where = { id };
			await prisma.mediaProvider.update({ where, data: o });
		} catch (e) {
			logger.error(e);
		}
	};

	await P.map(mediaProvidersToUpdate, updateOne, PRISMA_OPTIONS);

	logger.info('mediaProvider', {
		remote: remoteMediaProviders.length,
		unchanged: existingMediaProviders.length - mediaProvidersToUpdate.length,
		created: mediaProviderCreateResult.count,
		updated: mediaProvidersToUpdate.length,
	});
};

export const updateRelationships = async (medias: MediaResponse[]) => {
	logger.info('updating relationships...');
	const mediaIds = medias.map(toId);

	await loadCredits(medias, mediaIds);
	await loadProviders(medias, mediaIds);
};
