import { isBefore, parseISO } from 'date-fns';
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
import { tmdb } from '../../tmdb';
import { Video } from '../../types';

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
  }${
    form.castCreditName.length > 0
      ? ', cast_credit: cast_credit!inner(person!inner(name))'
      : ''
  }
  ${
    form.crewCreditName.length > 0
      ? ', crew_credit: crew_credit!inner(person!inner(name))'
      : ''
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

  if (form.castCreditName.length > 0) {
    query.ilike('cast_credit.person.name', `%${form.castCreditName}%`);
  }
  if (form.crewCreditName.length > 0) {
    query.ilike('crew_credit.person.name', `%${form.crewCreditName}%`);
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
  const select = ['*', 'watch_provider(id)'].join(',');

  return supabase
    .from('movie')
    .select(select)
    .in('id', ids)
    .order(form.sortColumn, { ascending: form.ascending })
    .order('id', { ascending: true });
};

export const useSearchFilms = ({ page }: { page: number }) => {
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

const fetchFilmQuery = async (id: number) => {
  const select = [
    '*',
    'watch_provider(id)',
    'cast_credit(*, person(*))',
    'crew_credit(*, person(*))',
  ].join(',');

  return supabase.from('movie').select(select).eq('id', id).single();
};

export const useFetchFilm = (id: number) => {
  return useQuery(['films', id], async () => {
    const { data: film } = await fetchFilmQuery(id);

    return film;
  });
};

const fetchTrailers = async (id: number) => {
  return tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'videos' },
  });
};

export const useFetchTrailers = (id: number) => {
  return useQuery<Video[]>(['films', id, 'trailers'], async () => {
    const { data: film } = await fetchTrailers(id);
    const videos: Video[] = film.videos.results;
    const trailers = videos
      .filter((v) => v.official && v.type === 'Trailer')
      .sort((v1, v2) =>
        isBefore(parseISO(v1.published_at), parseISO(v2.published_at)) ? 1 : -1,
      );

    return trailers;
  });
};
