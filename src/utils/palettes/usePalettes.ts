import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'lodash-es';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { toPalette } from '~/utils/palettes/palette';

export const usePalettes = ({
	items,
}: { items: { id: number; poster_path: string }[] }) => {
	const query = useQuery({
		queryKey: ['palettes', items],
		queryFn: async () => {
			const palettes = await Promise.all(
				items.map(async (item) => {
					const url = getTmdbImage({ path: item.poster_path });
					const palette = await toPalette(url);
					return { id: item.id, palette };
				}),
			);
			return keyBy(palettes, 'id');
		},
		staleTime: 1000 * 60 * 60 * 24,
	});

	return { palettes: query.data, ...query, data: undefined };
};

export const usePalette = ({ path }: { path: string }) => {
	const query = useQuery({
		queryKey: ['palette', path],
		queryFn: () => {
			const url = getTmdbImage({ path });
			return toPalette(url);
		},
		staleTime: 1000 * 60 * 60 * 24,
	});

	return { palette: query.data, ...query, data: undefined };
};
