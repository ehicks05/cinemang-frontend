import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fetchGenres = async () => {
	const result = await supabase.from('genre').select('*');
	return result.data || [];
};

const fetchLanguages = async () => {
	const result = await supabase
		.from('language')
		.select('*')
		.order('count', { ascending: false });
	return result.data || [];
};

const fetchProviders = async () => {
	const result = await supabase
		.from('provider')
		.select('*')
		.order('display_priority');
	return result.data || [];
};

const fetchData = async () => {
	const [genres, languages, providers] = await Promise.all([
		fetchGenres(),
		fetchLanguages(),
		fetchProviders(),
	]);

	return { genres, languages, providers };
};

export const useFetchSystemData = () =>
	useQuery({ queryKey: ['systemData'], queryFn: fetchData });
