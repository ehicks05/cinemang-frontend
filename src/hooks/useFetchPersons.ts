import type { Person } from '~/types/types';
import { supabase } from '~/utils/supabase';

export const getPersonById = async (id: number): Promise<Person> => {
	const select = ['*', 'credits: credit(*, movie(*), show(*))'].join(',');

	const result = await supabase.from('person').select(select).eq('id', id).single();
	return result.data as unknown as Person;
};
