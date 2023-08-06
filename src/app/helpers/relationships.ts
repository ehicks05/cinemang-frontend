import { Dictionary, differenceBy, keyBy } from 'lodash';
import { CreditType, Prisma } from '@prisma/client';
import P from 'bluebird';
import { getExistingPersonIds, isEqual } from './helpers';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import { MediaResponse } from '../../services/tmdb/types/responses';

const options = { concurrency: 32 };

const toId = (o: { id: number }) => o.id;

const toCreditCreateInput = (media: MediaResponse) =>
  [...media.credits.cast, ...media.credits.crew].map(c => ({
    ...mediaToRelationshipKey(media),
    personId: c.id,
    creditId: c.credit_id,
    type: CreditType.CAST, // default, should be overriden below
    ...('character' in c && {
      type: CreditType.CAST,
      character: c.character,
      castId: c.cast_id,
      order: c.order,
    }),
    ...('job' in c && {
      type: CreditType.CREW,
      department: c.department,
      job: c.job,
    }),
  }));

const mediaToRelationshipKey = (media: MediaResponse) => {
  if ('title' in media) return { movieId: media.id };
  if ('name' in media) return { seriesId: media.id };
  throw new Error('unrecognized media object');
};

const mediaToWhereClauseKey = (media: MediaResponse) => {
  if ('title' in media) return 'movieId';
  if ('name' in media) return 'seriesId';
  throw new Error('unrecognized media object');
};

const toCreditId = (o: { creditId: string }) => o.creditId;

const loadCredits = async (
  medias: MediaResponse[],
  mediaIds: number[],
  personIdMap: Dictionary<number>,
) => {
  const remoteCredits: Prisma.CreditUncheckedCreateInput[] = medias
    .flatMap(toCreditCreateInput)
    .filter(o => personIdMap[o.personId]);
  const whereClauseKey = mediaToWhereClauseKey(medias[0]);
  const localCredits = await prisma.credit.findMany({
    where: {
      [whereClauseKey]: { in: mediaIds },
    },
  });
  const localCreditsById = keyBy(localCredits, o => o.creditId);

  const creditsToCreate = differenceBy(remoteCredits, localCredits, toCreditId);
  const existingCredits = differenceBy(remoteCredits, creditsToCreate, toCreditId);
  const creditsToUpdate = existingCredits.filter(o => {
    const p = localCreditsById[o.creditId];
    return p && !isEqual(o, p);
  });

  try {
    const creditCreateResult = await prisma.credit.createMany({
      data: creditsToCreate,
    });

    const updateOne = async (o: Prisma.CreditUncheckedCreateInput) => {
      try {
        const where = { creditId: o.creditId };
        prisma.credit.update({ where, data: o });
      } catch (e) {
        logger.error(e);
      }
    };

    await P.map(creditsToUpdate, updateOne, options);

    logger.info('credit', {
      remote: remoteCredits.length,
      unchanged: existingCredits.length - creditsToUpdate.length,
      created: creditCreateResult.count,
      updated: creditsToUpdate.length,
    });
  } catch (e) {
    logger.error(e);
  }
};

const toComparisonId = (o: {
  movieId?: number | null;
  seriesId?: number | null;
  watchProviderId: number;
}) => `${o.movieId || o.seriesId}-${o.watchProviderId}`;

const getProvidersById = async () => {
  const providers = await prisma.watchProvider.findMany({
    select: { id: true },
  });
  return keyBy(providers, toId);
};

const toMediaProviderCreateInput = (media: MediaResponse) => {
  const providers = media['watch/providers'].results.US?.flatrate || [];
  return (
    providers
      // // CBS (provider_id:78) seems to be sneaking in to US results
      .filter(p => p.provider_id !== 78)
      .map(p => ({
        ...mediaToRelationshipKey(media),
        watchProviderId: p.provider_id,
      }))
  );
};

const loadProviders = async (medias: MediaResponse[], mediaIds: number[]) => {
  const providersById = await getProvidersById();
  const remoteMediaProviders: Prisma.MediaWatchProviderUncheckedCreateInput[] =
    medias
      .map(toMediaProviderCreateInput)
      .flat()
      .filter(o => o && providersById[o.watchProviderId]);

  const whereClauseKey = mediaToWhereClauseKey(medias[0]);
  const localMediaProviders = await prisma.mediaWatchProvider.findMany({
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
  const mediaProvidersToUpdate = existingMediaProviders.filter(o => {
    const key = toComparisonId(o);
    const p = localMediaProvidersById[key];
    return p && !isEqual(o, p);
  });

  const mediaProviderCreateResult = await prisma.mediaWatchProvider.createMany({
    data: newMediaProviders,
  });

  const updateOne = async (o: Prisma.MediaWatchProviderUncheckedUpdateInput) => {
    const id = localMediaProviders.find(
      local =>
        local.movieId === o.movieId &&
        local.seriesId === o.seriesId &&
        local.watchProviderId === o.watchProviderId,
    )?.id;
    try {
      const where = { id };
      prisma.mediaWatchProvider.update({ where, data: o });
    } catch (e) {
      logger.error(e);
    }
  };

  await P.map(mediaProvidersToUpdate, updateOne, options);

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
  const personIds = await getExistingPersonIds(medias);
  const personIdMap = keyBy(personIds, o => o);

  await loadCredits(medias, mediaIds, personIdMap);
  await loadProviders(medias, mediaIds);
};
