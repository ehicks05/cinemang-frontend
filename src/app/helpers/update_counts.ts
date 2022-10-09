import { WatchProvider } from '@prisma/client';
import logger from '../../services/logger';
import prisma from '../../services/prisma';

export const updateLanguageCounts = async () => {
  const [languages, languageCounts] = await Promise.all([
    prisma.language.findMany(),
    prisma.movie.groupBy({
      by: ['languageId'],
      _count: true,
    }),
  ]);

  const languagesWithCounts = languages.map((l) => {
    const lc = languageCounts.find((lc) => lc.languageId === l.id);
    const count = lc ? lc._count : l.count;
    return { ...l, count };
  });

  await prisma.language.deleteMany();
  await prisma.language.createMany({ data: languagesWithCounts });

  logger.info(`updated language counts`);
};

export const updateWatchProviderCounts = async () => {
  const providers = await prisma.watchProvider.findMany();

  const getCountsForProvider = async (p: WatchProvider) => {
    const count = await prisma.movie.count({
      where: {
        watchProviders: { some: { provider_id: { equals: p.provider_id } } },
      },
    });
    return { ...p, count };
  };

  const watchProviders = await Promise.all(providers.map(getCountsForProvider));

  await Promise.all(
    watchProviders.map(async (p) => {
      await prisma.watchProvider.upsert({
        create: p,
        update: p,
        where: { provider_id: p.provider_id },
      });
    }),
  );

  logger.info(`updated watch provider counts`);
};
