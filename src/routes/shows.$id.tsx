import { ShowDetail } from '@/app/components/FilmDetail/ShowDetail';
import { Loading } from '@/core-components';
import { fetchShowQuery } from '@/hooks/useFetchShows';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from '..';

const ShowPage = () => {
	const { id } = Route.useParams();
	const { data: show } = useSuspenseQuery({
		queryKey: ['show', id],
		queryFn: () => fetchShowQuery(Number(id)),
	});

	return <ShowDetail show={show} />;
};

export const Route = createFileRoute('/shows/$id')({
	loader: ({ params: { id } }) =>
		queryClient.ensureQueryData({
			queryKey: ['show', id],
			queryFn: () => fetchShowQuery(Number(id)),
		}),
	component: ShowPage,
	pendingComponent: Loading,
	errorComponent: () => <Loading error={{ message: 'Unable to find show' }} />,
});
