import { useQuery } from '@tanstack/react-query';

import { supabase } from '../supabase';
import { Person } from '@/types';

const fetchPersonQuery = async (id: number): Promise<Person> => {
  const select = ['*', 'cast_credit(*, movie(*))', 'crew_credit(*, movie(*))'].join(
    ',',
  );

  const result = await supabase.from('person').select(select).eq('id', id).single();
  return result.data as unknown as Person;
};

export const useFetchPerson = (id: number) =>
  useQuery(['person', id], async () => fetchPersonQuery(id));
