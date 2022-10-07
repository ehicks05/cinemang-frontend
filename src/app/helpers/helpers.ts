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
  await prisma.watchProvider.deleteMany();
  await prisma.watchProvider.createMany({ data });
  logger.info(`loaded ${data.length} watch providers`);
};
