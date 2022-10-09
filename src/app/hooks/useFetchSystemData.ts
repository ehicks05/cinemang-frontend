import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Genre, Language, WatchProvider } from '../../types';

const fetchGenres = async () => {
  const result = await supabase.from('genre').select('*');
  const genres: Genre[] = result.data || [];
  return genres;
};

const fetchLanguages = async () => {
  const result = await supabase
    .from('language')
    .select('*')
    .order('count', { ascending: false });
  const languages: Language[] = result.data || [];
  return languages;
};

const fetchWatchProviders = async () => {
  const result = await supabase
    .from('watch_provider')
    .select('*')
    .order('display_priority');
  const watchProviders: WatchProvider[] = result.data || [];
  return watchProviders;
};

const fetchData = async () => {
  const [genres, languages, watchProviders] = await Promise.all([
    fetchGenres(),
    fetchLanguages(),
    fetchWatchProviders(),
  ]);

  return { genres, languages, watchProviders };
};

export const useFetchSystemData = () => {
  const [data, setData] = useState<{
    genres: Genre[];
    languages: Language[];
    watchProviders: WatchProvider[];
  }>({
    genres: [],
    languages: [],
    watchProviders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

    const doIt = async () => {
      try {
        const data = await fetchData();
        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    doIt();
  }, []);

  return { data, error, loading };
};
