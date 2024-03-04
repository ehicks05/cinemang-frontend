import { Paginator, SearchForm, ShowCard } from '@/app/components';
import {
	Loading,
	MediaLayout,
	MediaSkeleton,
	MediaSkeletons,
} from '@/core-components';
import { queryShows } from '@/hooks/useFetchShows';
import { DEFAULT_PALETTE, Palette, toPalette } from '@/hooks/usePalette';
import { DEFAULT_TV_SEARCH_FORM as SEARCH_FORM } from '@/queryParams';
import { getTmdbImage } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
import { Show } from '../types';

const Shows = ({ shows }: { shows: Show[] }) => {
	const [loading, setLoading] = useState(true);
	const [palettes, setPalettes] = useState<Record<number, Palette> | undefined>(
		undefined,
	);

	useMemo(() => {
		const doIt = async () => {
			setLoading(true);
			const palettes = await Promise.all(
				shows.map(async (show) => {
					const url = getTmdbImage({ path: show.poster_path });
					const palette = await toPalette(url);
					return { id: show.id, palette };
				}),
			);
			setPalettes(
				palettes.reduce(
					(agg, curr) => {
						agg[curr.id] = curr.palette;
						return agg;
					},
					{} as Record<number, Palette>,
				),
			);
			setLoading(false);
		};
		if (shows.length !== 0) doIt();
	}, [shows]);

	return (
		<MediaLayout>
			{loading && shows.map((show) => <MediaSkeleton key={show.id} />)}
			{!loading &&
				shows.map((show) => (
					<ShowCard
						show={show}
						key={show.id}
						palette={palettes?.[show.id] || DEFAULT_PALETTE}
					/>
				))}
		</MediaLayout>
	);
};

const ShowsWrapper = () => {
	useTitle('Cinemang');
	const search = Route.useSearch();
	const {
		data: { shows, count },
	} = useSuspenseQuery({
		queryKey: ['shows', search],
		queryFn: () => queryShows(search),
	});

	return (
		<>
			<Paginator count={count} page={search.page} />
			<Shows shows={shows || []} />
			<Paginator count={count} page={search.page} />
		</>
	);
};

const Home = () => (
	<div className="flex flex-col sm:gap-4">
		<SearchForm />
		<ShowsWrapper />
	</div>
);

type ShowSortColumn = 'vote_count' | 'vote_average' | 'first_air_date';

export interface ShowSearch {
	ascending: boolean;
	creditName: string;
	genre: string;
	language: string;
	maxRating: number;
	maxVotes: number;
	minRating: number;
	page: number;
	providers: number[];

	maxFirstAirDate: string;
	minFirstAirDate: string;
	minVotes: number;
	sortColumn: ShowSortColumn;
	name: string;
}

export const Route = createFileRoute('/shows')({
	validateSearch: (search: Record<string, unknown>): ShowSearch => {
		return {
			ascending: (search.ascending as boolean) || SEARCH_FORM.ascending,
			creditName: (search.creditName as string) || SEARCH_FORM.creditName,
			genre: (search.genre as string) || SEARCH_FORM.genre,
			language: (search.language as string) || SEARCH_FORM.language,
			maxRating: (search.maxRating as number) || SEARCH_FORM.maxRating,
			maxVotes: (search.maxVotes as number) || SEARCH_FORM.maxVotes,
			minRating: (search.minRating as number) || SEARCH_FORM.minRating,
			page: (search.page as number) || SEARCH_FORM.page,
			providers: (search.providers as number[]) || SEARCH_FORM.providers,

			maxFirstAirDate:
				(search.maxFirstAirDate as string) || SEARCH_FORM.maxFirstAirDate,
			minFirstAirDate:
				(search.minFirstAirDate as string) || SEARCH_FORM.minFirstAirDate,
			minVotes: (search.minVotes as number) || SEARCH_FORM.minVotes,
			sortColumn: (search.sortColumn as ShowSortColumn) || SEARCH_FORM.sortColumn,
			name: (search.name as string) || SEARCH_FORM.name,
		};
	},
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData({
			queryKey: ['shows', search],
			queryFn: () => queryShows(search),
		}),
	pendingComponent: MediaSkeletons,
	errorComponent: ({ error }) => <Loading error={error} loading={false} />,
	component: Home,
});
