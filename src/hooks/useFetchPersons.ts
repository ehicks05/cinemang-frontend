import { useQuery } from '@tanstack/react-query';

import { Person } from '@/types';
import { supabase } from '../supabase';

const fetchPersonQuery = async (id: number): Promise<Person> => {
	const select = ['*', 'credits: credit(*, movie(*), show(*))'].join(',');

	const result = await supabase.from('person').select(select).eq('id', id).single();
	return result.data as unknown as Person;
};

export const useFetchPerson = (id: number) =>
	useQuery({ queryKey: ['person', id], queryFn: async () => fetchPersonQuery(id) });
