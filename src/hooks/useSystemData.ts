import { getRouteApi } from '@tanstack/react-router';

export const useSystemData = () => {
	const routeApi = getRouteApi('__root__');
	const data = routeApi.useLoaderData();
	return data;
};
