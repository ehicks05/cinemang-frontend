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

const fetchWatchProviders = async () => {
  const result = await supabase
    .from('watch_provider')
    .select('*')
    .order('display_priority');
  return result.data || [];
};

const fetchData = async () => {
  const [genres, languages, watchProviders] = await Promise.all([
    fetchGenres(),
    fetchLanguages(),
    fetchWatchProviders(),
  ]);

  return { genres, languages, watchProviders };
};

export const useFetchSystemData = () =>
  useQuery(['systemData'], fetchData, {
    keepPreviousData: true,
  });
