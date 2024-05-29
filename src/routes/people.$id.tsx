import { PersonDetail } from '@/app/components';
import { Loading } from '@/core-components';
import { fetchPersonQuery } from '@/hooks/useFetchPersons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from '..';

const PersonPage = () => {
	const { id } = Route.useParams();
	const { data: person } = useSuspenseQuery({
		queryKey: ['people', id],
		queryFn: () => fetchPersonQuery(Number(id)),
	});

	return <PersonDetail person={person} />;
};

export const Route = createFileRoute('/people/$id')({
	loader: ({ params: { id } }) =>
		queryClient.ensureQueryData({
			queryKey: ['people', id],
			queryFn: () => fetchPersonQuery(Number(id)),
		}),
	component: PersonPage,
	pendingComponent: Loading,
	errorComponent: () => <Loading error={{ message: 'Unable to find person' }} />,
});
