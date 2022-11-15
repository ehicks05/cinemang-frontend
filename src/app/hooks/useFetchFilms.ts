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
  let castPersonIds;
  if (form.castCreditName.length > 2) {
    const query = supabase
      .from('person')
      .select('id')
      .ilike('name', `%${form.castCreditName}%`)
      .order('popularity', { ascending: false })
      .range(0, 100);
    castPersonIds = (await query).data?.map((o) => o.id);
  }
  let crewPersonIds;
  if (form.crewCreditName.length > 2) {
    const query = supabase
      .from('person')
      .select('id')
      .ilike('name', `%${form.crewCreditName}%`)
      .order('popularity', { ascending: false })
      .range(0, 100);
    crewPersonIds = (await query).data?.map((o) => o.id);
  }

  const select = `id${
    form.watchProviders.length > 0 ? ', wp: watch_provider!inner(id)' : ''
  }${
    form.castCreditName.length > 0
      ? ', cast_credit: cast_credit!inner(personId)'
      : ''
  }
  ${
    form.crewCreditName.length > 0
      ? ', crew_credit: crew_credit!inner(personId)'
      : ''
  }`;
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

  if (form.watchProviders.length > 0) {
    query.in('wp.id', form.watchProviders);
  }

  if ((castPersonIds || []).length > 0) {
    query.in('cast_credit.personId', castPersonIds || []);
  }
  if ((crewPersonIds || []).length > 0) {
    query.in('crew_credit.personId', crewPersonIds || []);
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
