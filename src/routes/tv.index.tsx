import { Outlet, createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { queryShows } from '~/hooks/useFetchShows';
import { ShowsWrapper } from '~/temp/app/Shows';
import { DEFAULT_TV_SEARCH_FORM } from '~/utils/searchParams/constants';
import { type TvSearchForm, TvSearchFormSchema } from '~/utils/searchParams/types';

export const Route = createFileRoute('/tv/')({
	search: { middlewares: [stripSearchParams(DEFAULT_TV_SEARCH_FORM)] },
	validateSearch: zodValidator(TvSearchFormSchema),
	loaderDeps: ({ search }: { search: TvSearchForm }) => {
		return { search };
	},
	loader: async ({ deps: { search } }) => queryShows(search),
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	const { shows, count } = Route.useLoaderData();

	return (
		<div className="p-2 flex gap-2">
			<ShowsWrapper shows={shows} count={count} />
			<hr />
			<Outlet />
		</div>
	);
}
