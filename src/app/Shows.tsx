import { MediaLayout, MediaSkeleton, MediaSkeletons } from '~/core-components';
import { Paginator } from '~/core-components/Paginator/Paginator';
import type { Show } from '~/types/types';
import { DEFAULT_PALETTE } from '~/utils/palettes/palette';
import { usePalettes } from '~/utils/palettes/usePalettes';
import { SearchForm, ShowCard } from './components';

const Shows = ({ shows }: { shows: Show[] }) => {
	const { isLoading, palettes } = usePalettes({ items: shows });

	return (
		<MediaLayout>
			{shows.map((show) =>
				isLoading ? (
					<MediaSkeleton key={show.id} />
				) : (
					<ShowCard
						key={show.id}
						show={show}
						palette={palettes?.[show.id].palette || DEFAULT_PALETTE}
					/>
				),
			)}
		</MediaLayout>
	);
};

export const ShowsWrapper = ({ shows, count }: { shows: Show[]; count: number }) => {
	const isLoading = false;

	return (
		<div className="flex flex-col sm:gap-4">
			<SearchForm />

			<Paginator count={count} isLoading={isLoading} />
			{isLoading && <MediaSkeletons />}
			{!isLoading && <Shows shows={shows || []} />}
			<Paginator count={count} isLoading={isLoading} />
		</div>
	);
};
