import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { FilmDetail } from '~/app/components';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { getFilmById } from '~/hooks/useFetchFilms';

export const Route = createFileRoute('/films/$filmId')({
	loader: async ({ params }) => {
		const film = await getFilmById(Number(params.filmId));
		const trailer = await fetchTrailer({ movieId: film.id });
		return { film, trailer };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
	ssr: false,
});

function RouteComponent() {
	const { film, trailer } = Route.useLoaderData();

	return <FilmDetail film={film} trailer={trailer} />;
}
