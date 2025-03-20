import { getRouteApi } from '@tanstack/react-router';
import { supabase } from '~/utils/supabase';

export const fetchSystemData = async () => {
	const [genres, languages, providers] = await Promise.all([
		supabase.from('genre').select('*'),
		supabase.from('language').select('*').order('count', { ascending: false }),
		supabase.from('provider').select('*').order('display_priority'),
	]);

	return {
		genres: genres.data || [],
		languages: languages.data || [],
		providers: providers.data || [],
	};
};

export const useSystemData = () => {
	const routeApi = getRouteApi('__root__');
	const data = routeApi.useLoaderData();
	return data;
};
