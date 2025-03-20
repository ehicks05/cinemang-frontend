import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { ShowDetailWrapper } from '~/app/components';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { getShowById } from '~/hooks/useFetchShows';

export const Route = createFileRoute('/tv/$showId')({
	loader: async ({ params }) => {
		const show = await getShowById(Number(params.showId));
		const trailer = await fetchTrailer({ movieId: show.id });
		return { show, trailer };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
	ssr: false,
});

function RouteComponent() {
	const { show, trailer } = Route.useLoaderData();

	return <ShowDetailWrapper show={show} trailer={trailer} />;
}
