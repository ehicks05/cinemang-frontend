import { MediaLayout, MediaSkeleton, MediaSkeletons } from '~/core-components';
import { Paginator } from '~/core-components/Paginator/Paginator';
import type { Film } from '~/types/types';
import { DEFAULT_PALETTE } from '~/utils/palettes/palette';
import { usePalettes } from '~/utils/palettes/usePalettes';
import { FilmCard, SearchForm } from './components';

const Films = ({ films }: { films: Film[] }) => {
	const { isLoading, palettes } = usePalettes({ items: films });

	return (
		<MediaLayout>
			{films.map((film) =>
				isLoading ? (
					<MediaSkeleton key={film.id} />
				) : (
					<FilmCard
						key={film.id}
						film={film}
						palette={palettes?.[film.id].palette || DEFAULT_PALETTE}
					/>
				),
			)}
		</MediaLayout>
	);
};

export const FilmsWrapper = ({ films, count }: { films: Film[]; count: number }) => {
	const isLoading = false;

	return (
		<div className="flex flex-col sm:gap-4">
			<SearchForm />

			<Paginator count={count} isLoading={isLoading} />
			{isLoading && <MediaSkeletons />}
			{!isLoading && <Films films={films || []} />}
			<Paginator count={count} isLoading={isLoading} />
		</div>
	);
};
