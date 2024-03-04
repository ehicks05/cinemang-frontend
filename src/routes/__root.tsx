import { Footer, Header } from '@/core-components';
import { fetchSystemData } from '@/hooks/useFetchSystemData';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const systemDataQueryOptions = queryOptions({
	queryKey: ['systemData'],
	queryFn: fetchSystemData,
});

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(systemDataQueryOptions),

	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<div className="flex min-h-screen flex-col bg-gradient-to-tr from-indigo-900 to-green-900 text-gray-50">
				<Header />
				<div className="flex h-full flex-grow flex-col pb-4 sm:px-4">
					<Outlet />
				</div>
				<Footer />
			</div>

			<TanStackRouterDevtools />
		</>
	);
}
