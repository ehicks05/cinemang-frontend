import { chunk } from 'lodash';
import Promise from 'bluebird';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import {
  getGenres,
  getLanguages,
  getWatchProviders,
} from '../../services/tmdb';

export const updateGenres = async () => {
  const remoteRecords = await getGenres();
  const remoteIds = remoteRecords.map((o) => o.id);
  const localRecords = await prisma.genre.findMany();
  const localIds = localRecords.map((o) => o.id);

  const changes = {
    remote: remoteRecords.length,
    local: localRecords.length,
    created: 0,
    updated: 0,
    deleted: 0,
  };

  const toBeAdded = remoteRecords.filter((o) => !localIds.includes(o.id));
  if (toBeAdded.length !== 0) {
    const result = await prisma.genre.createMany({ data: toBeAdded });
    changes.created = result.count;
  }

  const toBeDeleted = localRecords.filter((g) => !remoteIds.includes(g.id));
  changes.deleted = toBeDeleted.length;
  await prisma.genre.deleteMany({
    where: { id: { in: toBeDeleted.map((o) => o.id) } },
  });

  const toBeUpdated = remoteRecords.filter((o) => {
    const pair = localRecords.find((local) => local.id === o.id);
    return o.name !== pair?.name;
  });

  await Promise.map(toBeUpdated, (o) =>
    prisma.genre.update({
      where: { id: o.id },
      data: o,
    }),
  );
  changes.updated = toBeUpdated.length;

  logger.info(`genres`, changes);
};

export const updateLanguages = async () => {
  const remoteRecords = (await getLanguages()).map((lang) => ({
    id: lang.iso_639_1,
    name: lang.english_name,
  }));
  const remoteIds = remoteRecords.map((o) => o.id);
  const localRecords = await prisma.language.findMany();
  const localIds = localRecords.map((o) => o.id);

  const changes = {
    remote: remoteRecords.length,
    local: localRecords.length,
    created: 0,
    updated: 0,
    deleted: 0,
  };

  const toBeAdded = remoteRecords.filter((o) => !localIds.includes(o.id));
  if (toBeAdded.length !== 0) {
    const result = await prisma.language.createMany({ data: toBeAdded });
    changes.created = result.count;
  }

  const toBeDeleted = localRecords.filter((g) => !remoteIds.includes(g.id));
  changes.deleted = toBeDeleted.length;
  await prisma.language.deleteMany({
    where: { id: { in: toBeDeleted.map((o) => o.id) } },
  });

  const toBeUpdated = remoteRecords.filter((o) => {
    const pair = localRecords.find((local) => local.id === o.id);
    return o.name !== pair?.name;
  });

  await Promise.map(toBeUpdated, (o) =>
    prisma.language.update({
      where: { id: o.id },
      data: o,
    }),
  );
  changes.updated = toBeUpdated.length;

  logger.info(`languages`, changes);
};

export const updateWatchProviders = async () => {
  const remoteRecords = (await getWatchProviders()).map((p) => ({
    displayPriority: p.display_priorities['US'],
    id: p.provider_id,
    logoPath: p.logo_path,
    name: p.provider_name,
  }));
  const remoteIds = remoteRecords.map((o) => o.id);
  const localRecords = await prisma.watchProvider.findMany();
  const localIds = localRecords.map((o) => o.id);

  const changes = {
    remote: remoteRecords.length,
    local: localRecords.length,
    created: 0,
    updated: 0,
    deleted: 0,
  };

  const toBeAdded = remoteRecords.filter((o) => !localIds.includes(o.id));
  if (toBeAdded.length !== 0) {
    const result = await prisma.watchProvider.createMany({ data: toBeAdded });
    changes.created = result.count;
  }

  const toBeDeleted = localRecords.filter((g) => !remoteIds.includes(g.id));
  changes.deleted = toBeDeleted.length;
  await prisma.watchProvider.deleteMany({
    where: { id: { in: toBeDeleted.map((o) => o.id) } },
  });

  const toBeUpdated = remoteRecords.filter((o) => {
    const pair = localRecords.find((local) => local.id === o.id);
    const isEqual =
      !pair ||
      (o.name === pair.name &&
        o.displayPriority === pair?.displayPriority &&
        o.logoPath === pair.logoPath);
    return !isEqual;
  });

  await Promise.map(toBeUpdated, async (o) =>
    prisma.watchProvider.update({
      where: { id: o.id },
      data: o,
    }),
  );
  changes.updated = toBeUpdated.length;

  logger.info(`watch providers `, changes);
};

// TODO: chunk and process the validIds instead of fetching all ids
export const removeInvalidMovies = async (validIds: number[]) => {
  logger.info(`Removing records in the db that aren't in the valid ids file.`);
  const existingIds = (
    await prisma.movie.findMany({ select: { id: true } })
  ).map((m) => m.id);
  const invalidIds = existingIds.filter((e) => !validIds?.includes(e));
  const chunks = chunk(invalidIds, 10_000);
  await Promise.each(chunks, (ids) =>
    prisma.movie.deleteMany({
      where: { id: { in: ids } },
    }),
  );
  logger.info(`removed ${invalidIds.length} invalid records`);
};
