import { isBefore, parseISO } from 'date-fns';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'react-use';
import {
  DecodedValueMap,
  QueryParamConfigMap,
  useQueryParams,
} from 'use-query-params';
import { PAGE_SIZE } from '../constants';
import { supabase } from '../supabase';
import { tmdb } from '../tmdb';
import { Film, TvSeries, Video } from '../types';
import { MOVIE_QUERY_PARAMS } from '@/queryParams';

const idQuery = async (form: DecodedValueMap<QueryParamConfigMap>, page: number) => {
  let creditPersonIds;
  if (form.creditName.length > 2) {
    const query = supabase
      .from('person')
      .select('id')
      .ilike('name', `%${form.creditName}%`)
      .order('popularity', { ascending: false })
      .range(0, 100);
    creditPersonIds = (await query).data?.map(o => o.id);
  }

  const select = `id${
    form.providers.length > 0
      ? ', wp: media_watch_provider!inner(watchProviderId)'
      : ''
  }${form.creditName.length > 0 ? ', credit: credit!inner(person_id)' : ''}`;
  const query = supabase.from('movie').select(select, { count: 'exact' });

  if (form.title) {
    query.ilike('title', `%${form.title}%`);
  }

  if (form.minVotes !== 0) {
    query.gte('vote_count', form.minVotes);
  }
  if (form.maxVotes !== 100_000_0000) {
    query.lte('vote_count', form.maxVotes);
  }
  if (form.minRating !== 0) {
    query.gte('vote_average', form.minRating);
  }
  if (form.maxRating !== 10) {
    query.lte('vote_average', form.maxRating);
  }

  if (form.minReleasedAt) {
    query.gte('released_at', form.minReleasedAt);
  }
  if (form.maxReleasedAt) {
    query.lte('released_at', form.maxReleasedAt);
  }

  if (form.genre) {
    query.eq('genre_id', form.genre);
  }
  if (form.language) {
    query.like('language_id', form.language);
  }

  if (form.providers.length > 0) {
    query.in('wp.watchProviderId', form.providers);
  }

  if ((creditPersonIds || []).length > 0) {
    query.in('credit.person_id', creditPersonIds || []);
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
    'watch_provider: media_watch_provider(id: watchProviderId)',
  ].join(',');

  const result = await supabase
    .from('movie')
    .select(select)
    .in('id', ids)
    .order(form.sortColumn, { ascending: form.ascending })
    .order('id', { ascending: true });
  return result.data as unknown as Film[];
};

export const useSearchFilms = ({ page }: { page: number }) => {
  const [formParams] = useQueryParams(MOVIE_QUERY_PARAMS);

  // a local, debounced copy of the form
  const [form, setForm] = useState(formParams);

  useDebounce(
    () => {
      setForm(formParams);
    },
    250,
    [formParams],
  );

  return useQuery(['films', form, page], async () => {
    // query 1: identify the ids for our search results
    const { data, count } = (await idQuery(form, page)) as unknown as {
      data: { id: number }[];
      count: number;
    };
    const ids = data?.map(row => row.id) || [];

    // query 2: fetch data for the ids
    const films = await hydrationQuery(ids, form);

    return { count: count || 0, films };
  });
};

const fetchFilmQuery = async (id: number) => {
  const select = [
    '*',
    'watch_provider: media_watch_provider(id: watchProviderId)',
    'credits: credit(*, person(*))',
  ].join(',');

  const result = await supabase.from('movie').select(select).eq('id', id).single();
  return result.data as unknown as Film;
};

export const useFetchFilm = (id: number) =>
  useQuery(['films', id], async () => fetchFilmQuery(id));

const fetchTrailers = async (id: number) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'videos' },
  });

export const useFetchTrailers = (id: number) =>
  useQuery<Video[]>(['films', id, 'trailers'], async () => {
    const { data: film } = await fetchTrailers(id);
    const videos: Video[] = film.videos.results;
    const trailers = videos
      .filter(v => v.official && v.type === 'Trailer')
      .sort((v1, v2) =>
        isBefore(parseISO(v1.published_at), parseISO(v2.published_at)) ? 1 : -1,
      );

    return trailers;
  });

const fetchTvSeries = async () => {
  const select = [
    '*',
    'credits: credit(*, person(*))',
    'watch_provider: media_watch_provider(id: watchProviderId)',
  ].join(',');

  const result = await supabase
    .from('tv_series')
    .select(select as any)
    .order('first_air_date', { ascending: true })
    .order('id', { ascending: true });
  return result.data as unknown as TvSeries[];
};

export const useFetchTvSerieses = () => useQuery(['tvSerieses'], fetchTvSeries);
