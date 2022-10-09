import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { useQueryParams } from 'use-query-params';
import { PAGE_SIZE } from '../../constants';
import { supabase } from '../../supabase';

interface Data {
  count: number;
  films: any[] | null;
}

export const useFetchFilms = ({ page }: { page: number }) => {
  const [formParams] = useQueryParams();

  const [form, setForm] = useState(formParams);
  const [data, setData] = useState<Data>({ count: 0, films: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useDebounce(
    () => {
      setForm(formParams);
    },
    250,
    [formParams],
  );

  useEffect(() => {
    setLoading(true);

    const fetchFilms = async () => {
      try {
        const query = supabase
          .from('movie')
          .select(
            '*, watch_provider(provider_id), wp:watch_provider!inner(provider_id)',
            { count: 'exact' },
          )
          .ilike('title', `%${form.title || ''}%`)
          .gte('vote_count', form.minVotes || 0)
          .lte('vote_count', form.maxVotes || 100_000_000)
          .gte('vote_average', form.minRating || 0)
          .lte('vote_average', form.maxRating || 10)
          .gte('released_at', form.minReleasedAt || '1870-01-01')
          .lte(
            'released_at',
            form.maxReleasedAt || new Date().toLocaleDateString(),
          )
          .like('language_id', form.language || '*');

        if (form.genre) {
          query.eq('genre_id', form.genre || '*');
        }

        if (form.watchProviders.length > 0) {
          query.in('wp.provider_id', form.watchProviders);
        }

        query
          .order(form.sortColumn, { ascending: form.ascending })
          .order('tmdb_id', { ascending: true })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        const { data: films, count } = await query;
        setData({ count: count || 0, films });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [form, page]);

  return { data, error, loading };
};
