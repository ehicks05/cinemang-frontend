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
  const data = await getGenres();
  await prisma.genre.deleteMany();
  await prisma.genre.createMany({ data });
  logger.info(`loaded ${data.length} genres`);
};

export const updateLanguages = async () => {
  const data = (await getLanguages()).map((lang) => ({
    id: lang.iso_639_1,
    name: lang.english_name,
  }));
  await prisma.language.deleteMany();
  await prisma.language.createMany({ data });
  logger.info(`loaded ${data.length} languages`);
};

export const updateWatchProviders = async () => {
  const data = (await getWatchProviders()).map((p) => ({
    displayPriority: p.display_priorities['US'],
    id: p.provider_id,
    logoPath: p.logo_path,
    name: p.provider_name,
  }));
  await prisma.watchProvider.deleteMany();
  await prisma.watchProvider.createMany({ data });
  logger.info(`loaded ${data.length} watch providers`);
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
