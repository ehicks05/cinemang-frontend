import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'react-use';
import {
  DecodedValueMap,
  QueryParamConfigMap,
  useQueryParams,
} from 'use-query-params';
import { PAGE_SIZE } from '../../constants';
import { supabase } from '../../supabase';

interface Data {
  count: number;
  films: any[] | null;
}

const idQuery = async (
  form: DecodedValueMap<QueryParamConfigMap>,
  page: number,
) => {
  const select = `id${
    form.watchProviders.length > 0 ? ', wp: watch_provider!inner(id)' : ''
  }`;
  const query = supabase
    .from('movie')
    .select(select, { count: 'exact' })
    .ilike('title', `%${form.title || ''}%`)
    .gte('vote_count', form.minVotes || 0)
    .lte('vote_count', form.maxVotes || 100_000_000)
    .gte('vote_average', form.minRating || 0)
    .lte('vote_average', form.maxRating || 10)
    .gte('released_at', form.minReleasedAt || '1870-01-01')
    .lte('released_at', form.maxReleasedAt || new Date().toLocaleDateString())
    .like('language_id', form.language || '*');

  if (form.genre) {
    query.eq('genre_id', form.genre || '*');
  }

  if (form.watchProviders.length > 0) {
    query.in('wp.id', form.watchProviders);
  }

  query
    .order(form.sortColumn, { ascending: form.ascending })
    .order('id', { ascending: true })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  return query;
};

const hydrationQuery = async (
  ids: number[],
  form: DecodedValueMap<QueryParamConfigMap>,
) => {
  const select = [
    '*',
    'watch_provider(id)',
    'cast_credit(*, person(*))',
    'crew_credit(*, person(*))',
  ].join(',');

  return supabase
    .from('movie')
    .select(select)
    .in('id', ids)
    .order(form.sortColumn, { ascending: form.ascending })
    .order('id', { ascending: true });
};

export const useFetchFilms = ({ page }: { page: number }) => {
  const [formParams] = useQueryParams();

  // a local, debounced copy of the form
  const [form, setForm] = useState(formParams);

  useDebounce(
    () => {
      setForm(formParams);
    },
    250,
    [formParams],
  );

  return useQuery<Data>(['films', form, page], async () => {
    // query 1: identify the ids for our search results
    const { data, count } = await idQuery(form, page);
    const ids = data?.map((row) => row.id) || [];

    // query 2: fetch data for the ids
    const { data: films } = await hydrationQuery(ids, form);

    return { count: count || 0, films };
  });
};
