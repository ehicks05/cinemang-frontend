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

  const setUSPriority = (p: WatchProvider) => {
    const usPriority = p.display_priorities['US'];
    return {
      ...p,
      display_priority: usPriority,
      display_priorities: undefined,
    };
  };

  const watchProviders = data.map(setUSPriority);

  const existingIds = (await prisma.watchProvider.findMany()).map(
    (e) => e.provider_id,
  );

  const newProviders = watchProviders.filter(
    (d: { provider_id: number }) => !existingIds.includes(d.provider_id),
  );

  const existingProviders = watchProviders.filter(
    (d: { provider_id: number }) => existingIds.includes(d.provider_id),
  );

  await prisma.watchProvider.createMany({ data: newProviders });
  logger.info(`added ${newProviders.length} watch providers`);

  // await prisma.watchProvider.updateMany({ data: existingProviders });

  await Promise.all(
    existingProviders.map(async (p) => {
      await prisma.watchProvider.update({
        data: p,
        where: { provider_id: p.provider_id },
      });
    }),
  );

  logger.info(`updated ${existingProviders.length} watch providers`);
};
