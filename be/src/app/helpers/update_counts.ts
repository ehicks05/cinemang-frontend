import { omit } from 'lodash-es';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';

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

	await Promise.all(
		languagesWithCounts.map((o) =>
			prisma.language.update({ data: o, where: { id: o.id } }),
		),
	);

	logger.info('updated language counts');
};

export const updateProviderCounts = async () => {
	const providersWithCounts = await prisma.provider.findMany({
		include: {
			_count: {
				select: {
					medias: true,
				},
			},
		},
	});

	const providers = providersWithCounts.map((wp) => ({
		...omit(wp, ['_count']),
		count: wp._count.medias,
	}));

	await Promise.all(
		providers.map(async (p) => {
			await prisma.provider.update({
				data: p,
				where: { id: p.id },
			});
		}),
	);

	logger.info('updated watch provider counts');
};
