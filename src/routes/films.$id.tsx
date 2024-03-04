import { FilmDetail } from '@/app/components/FilmDetail';
import { Loading } from '@/core-components';
import { fetchFilmQuery } from '@/hooks/useFetchFilms';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from '..';

const FilmPage = () => {
	const { id } = Route.useParams();
	const { data: film } = useSuspenseQuery({
		queryKey: ['film', id],
		queryFn: () => fetchFilmQuery(Number(id)),
	});

	return <FilmDetail film={film} />;
};

export const Route = createFileRoute('/films/$id')({
	loader: ({ params: { id } }) =>
		queryClient.ensureQueryData({
			queryKey: ['film', id],
			queryFn: () => fetchFilmQuery(Number(id)),
		}),
	component: FilmPage,
	pendingComponent: Loading,
	errorComponent: () => <Loading error={{ message: 'Unable to find film' }} />,
});
