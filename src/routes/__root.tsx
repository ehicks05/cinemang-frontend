import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type * as React from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { Footer, Header } from '~/core-components';
import { fetchSystemData } from '~/hooks/fetchSystemData';
import appCss from '~/styles/app.css?url';
import { seo } from '~/utils/seo';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			...seo({
				title: 'Cinemang | Find something to watch',
				description: 'Cinemang helps you find something to watch.',
			}),
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{
				rel: 'preconnect',
				href: 'https://fonts.googleapis.com',
			},
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Urbanist&display=swap',
			},
			{
				rel: 'apple-touch-icon',
				type: 'image/svg',
				sizes: '180x180',
				href: '/favicon.svg',
			},
			{
				rel: 'icon',
				type: 'image/svg',
				sizes: '32x32',
				href: '/favicon.svg',
			},
			{
				rel: 'icon',
				type: 'image/svg',
				sizes: '16x16',
				href: '/favicon.svg',
			},
			{ rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
			{ rel: 'icon', href: '/favicon.svg' },
		],
	}),
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
	loader: async () => fetchSystemData(),
	staleTime: 1000 * 60 * 60,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</QueryClientProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="flex min-h-screen flex-col bg-gradient-to-tr from-indigo-900 to-green-900 text-gray-50">
					<Header />
					<div className="flex h-full flex-grow flex-col pb-4 sm:px-4">
						{children}
						<Footer />
					</div>
				</div>
				<TanStackRouterDevtools position="bottom-left" />
				<Scripts />
			</body>
		</html>
	);
}
