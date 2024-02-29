import { SHOW_QUERY_PARAMS } from '@/queryParams';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { DecodedValueMap, useQueryParams } from 'use-query-params';
import { PAGE_SIZE } from '../constants';
import { supabase } from '../supabase';
import { Show } from '../types';
import { CREDIT_PERSON_JOIN, PROVIDER_JOIN } from './constants';

const queryPersonIdsByName = async (name: string) => {
	const query = supabase
		.from('person')
		.select('id')
		.ilike('name', `%${name}%`)
		.order('popularity', { ascending: false })
		.range(0, 100);
	return (await query).data?.map((o) => o.id) || [];
};

const queryFilms = async (form: DecodedValueMap<typeof SHOW_QUERY_PARAMS>) => {
	const creditPersonIds: number[] =
		form.creditName.length > 2 ? await queryPersonIdsByName(form.creditName) : [];

	// filtered providers for a movie, for searching
	const providerSearch =
		form.providers.length > 0 ? ['wp: media_provider!inner(provider_id)'] : [];

	const creditSearch =
		form.creditName.length > 0 ? ['credit: credit!inner(person_id)'] : [];

	const select = ['*', PROVIDER_JOIN, ...providerSearch, ...creditSearch].join(', ');

	const query = supabase.from('show').select(select, { count: 'exact' });

	if (form.name) {
		query.ilike('name', `%${form.name}%`);
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

	if (form.minFirstAirDate) {
		query.gte('first_air_date', form.minFirstAirDate);
	}
	if (form.maxFirstAirDate) {
		query.lte('first_air_date', form.maxFirstAirDate);
	}

	if (form.genre) {
		query.eq('genre_id', form.genre);
	}
	if (form.language) {
		query.like('language_id', form.language);
	}

	if (form.providers.length > 0) {
		query.in('wp.provider_id', form.providers);
	}

	if (creditPersonIds.length > 0) {
		query.in('credit.person_id', creditPersonIds || []);
	}

	query
		.order(form.sortColumn, { ascending: form.ascending, foreignTable: '' })
		.order('id', { ascending: true })
		.range(form.page * PAGE_SIZE, (form.page + 1) * PAGE_SIZE - 1);

	return query;
};

export const useSearchShows = () => {
	const [formParams] = useQueryParams(SHOW_QUERY_PARAMS);

	// a local, debounced copy of the form
	const [form, setForm] = useState(formParams);

	useDebounce(
		() => {
			setForm(formParams);
		},
		250,
		[formParams],
	);

	return useQuery({
		queryKey: ['shows', form],
		queryFn: async () => {
			const { data: shows, count } = (await queryFilms(form)) as unknown as {
				data: Show[];
				count: number;
			};

			return { count: count || 0, shows };
		},
	});
};

const fetchShowQuery = async (id: number) => {
	const select = [
		'*',
		PROVIDER_JOIN,
		CREDIT_PERSON_JOIN,
		'seasons: season(*, episodes: episode(*))',
	].join(',');

	const result = await supabase.from('show').select(select).eq('id', id).single();
	return result.data as unknown as Show;
};

export const useFetchShow = (id: number) =>
	useQuery({ queryKey: ['shows', id], queryFn: async () => fetchShowQuery(id) });
