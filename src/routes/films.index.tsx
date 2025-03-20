import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { queryFilms } from '~/hooks/useFetchFilms';
import { DEFAULT_MOVIE_SEARCH_FORM } from '~/utils/searchParams/constants';
import {
	type MovieSearchForm,
	MovieSearchFormSchema,
} from '~/utils/searchParams/types';
import { FilmsWrapper } from '../app/Films';

export const Route = createFileRoute('/films/')({
	search: {
		middlewares: [
			stripSearchParams(DEFAULT_MOVIE_SEARCH_FORM),
			// retainSearchParams(true),
		],
	},
	validateSearch: zodValidator(MovieSearchFormSchema),
	loaderDeps: ({ search }: { search: MovieSearchForm }) => {
		return { search };
	},
	loader: async ({ deps: { search } }) => queryFilms(search),
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	const { films, count } = Route.useLoaderData();

	return <FilmsWrapper films={films} count={count} />;
}
