import { FilmCard, Paginator, SearchForm } from '@/app/components';
import {
	Loading,
	MediaLayout,
	MediaSkeleton,
	MediaSkeletons,
} from '@/core-components';
import { queryFilms } from '@/hooks/useFetchFilms';
import { DEFAULT_PALETTE, Palette, toPalette } from '@/hooks/usePalette';
import { DEFAULT_MOVIE_SEARCH_FORM as SEARCH_FORM } from '@/queryParams';
import { getTmdbImage } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
import { Film } from '../types';

const Films = ({ films }: { films: Film[] }) => {
	const [loading, setLoading] = useState(true);
	const [palettes, setPalettes] = useState<Record<number, Palette> | undefined>(
		undefined,
	);

	useMemo(() => {
		const doIt = async () => {
			setLoading(true);
			const palettes = await Promise.all(
				films.map(async (film) => {
					const url = getTmdbImage({ path: film.poster_path });
					const palette = await toPalette(url);
					return { id: film.id, palette };
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
		if (films.length !== 0) doIt();
	}, [films]);

	return (
		<MediaLayout>
			{loading && films.map((film) => <MediaSkeleton key={film.id} />)}
			{!loading &&
				films.map((film) => (
					<FilmCard
						film={film}
						key={film.id}
						palette={palettes?.[film.id] || DEFAULT_PALETTE}
					/>
				))}
		</MediaLayout>
	);
};

const FilmsWrapper = () => {
	useTitle('Cinemang');
	const search = Route.useSearch();
	const {
		data: { films, count },
	} = useSuspenseQuery({
		queryKey: ['films', search],
		queryFn: () => queryFilms(search),
	});

	return (
		<>
			<Paginator count={count} page={search.page} />
			<Films films={films || []} />
			<Paginator count={count} page={search.page} />
		</>
	);
};

const Home = () => (
	<div className="flex flex-col sm:gap-4">
		<SearchForm />
		<FilmsWrapper />
	</div>
);

type SortColumn = 'vote_count' | 'vote_average' | 'released_at';

export interface FilmSearch {
	ascending: boolean;
	creditName: string;
	genre: string;
	language: string;
	maxRating: number;
	maxVotes: number;
	minRating: number;
	page: number;
	providers: number[];

	maxReleasedAt: string;
	minReleasedAt: string;
	minVotes: number;
	sortColumn: SortColumn;
	title: string;
}

export const Route = createFileRoute('/')({
	validateSearch: (search: Record<string, unknown>): FilmSearch => {
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

			maxReleasedAt: (search.maxReleasedAt as string) || SEARCH_FORM.maxReleasedAt,
			minReleasedAt: (search.minReleasedAt as string) || SEARCH_FORM.minReleasedAt,
			minVotes: (search.minVotes as number) || SEARCH_FORM.minVotes,
			sortColumn: (search.sortColumn as SortColumn) || SEARCH_FORM.sortColumn,
			title: (search.title as string) || SEARCH_FORM.title,
		};
	},
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData({
			queryKey: ['films', search],
			queryFn: () => queryFilms(search),
		}),
	pendingComponent: MediaSkeletons,
	errorComponent: ({ error }) => <Loading error={error} loading={false} />,
	component: Home,
});
