import { chunk } from 'lodash';
import Promise from 'bluebird';
import logger from '../../services/logger';
import prisma from '../../services/prisma';
import {
  getGenres,
  getLanguages,
  getWatchProviders,
} from '../../services/tmdb';
import { WatchProvider } from '../../services/tmdb/types';

export const updateGenres = async () => {
  const data = await getGenres();
  await prisma.genre.deleteMany();
  await prisma.genre.createMany({ data });
  logger.info(`loaded ${data.length} genres`);
};

export const updateLanguages = async () => {
  const data = await getLanguages();
  const languages = data.map((lang) => ({
    id: lang.iso_639_1,
    name: lang.english_name,
  }));
  await prisma.language.deleteMany();
  await prisma.language.createMany({ data: languages });
  logger.info(`loaded ${data.length} languages`);
};

export const updateWatchProviders = async () => {
  const data = await getWatchProviders();

  const mapper = (p: WatchProvider) => {
    const usPriority = p.display_priorities['US'];
    return {
      displayPriority: usPriority,
      id: p.provider_id,
      logoPath: p.logo_path,
      name: p.provider_name,
    };
  };

  const watchProviders = data.map(mapper);

  await Promise.all(
    watchProviders.map(async (p) => {
      await prisma.watchProvider.upsert({
        create: p,
        update: p,
        where: { id: p.id },
      });
    }),
  );

  logger.info(`upserted ${watchProviders.length} watch providers`);
};

// TODO: chunk and process the validIds instead of fetching all ids
export const removeInvalidMovies = async (validIds: number[]) => {
  logger.info(
    `Deleting invalid records before continuing. Invalid = items in 
    the db that are missing from the valid ids file.`,
  );

  const existingIds = (
    await prisma.movie.findMany({ select: { id: true } })
  ).map((m) => m.id);
  const invalidIds = existingIds.filter((e) => !validIds?.includes(e));
  logger.info(`identified ${invalidIds.length} invalid records`);

  const chunks = chunk(invalidIds, 10_000);

  await Promise.each(chunks, (ids) =>
    prisma.movie.deleteMany({
      where: { id: { in: ids } },
    }),
  );

  logger.info(`finished deleting invalid records`);
};

// TODO: chunk and process the validIds instead of fetching all ids
// TODO deduplicate against removeDeadMovies
export const removeInvalidPeople = async (validIds: number[]) => {
  logger.info(
    `Deleting invalid records before continuing. Invalid = items in 
    the db that are missing from the valid ids file.`,
  );

  const existingIds = (
    await prisma.person.findMany({ select: { id: true } })
  ).map((m) => m.id);
  const invalidIds = existingIds.filter((e) => !validIds?.includes(e));
  logger.info(`identified ${invalidIds.length} invalid records`);

  const chunks = chunk(invalidIds, 10_000);

  await Promise.each(chunks, (ids) =>
    prisma.person.deleteMany({
      where: { id: { in: ids } },
    }),
  );

  logger.info(`finished deleting invalid records`);
};
