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
  const data = await getLanguages();
  await prisma.language.deleteMany();
  await prisma.language.createMany({ data });
  logger.info(`loaded ${data.length} languages`);
};

export const updateWatchProviders = async () => {
  const data = await getWatchProviders();
  const existingIds = (await prisma.watchProvider.findMany()).map(
    (e) => e.provider_id,
  );

  const newProviders = data.filter(
    (d: { provider_id: number }) => !existingIds.includes(d.provider_id),
  );

  await prisma.watchProvider.createMany({ data: newProviders });
  logger.info(`loaded ${data.length} watch providers`);
};
