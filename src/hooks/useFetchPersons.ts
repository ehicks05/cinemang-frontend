import { useQuery } from '@tanstack/react-query';

import { supabase } from '../supabase';

const fetchPersonQuery = async (id: number) => {
  const select = ['*', 'cast_credit(*, movie(*))', 'crew_credit(*, movie(*))'].join(
    ',',
  );

  return supabase.from('person').select(select).eq('id', id).single();
};

export const useFetchPerson = (id: number) =>
  useQuery(['person', id], async () => {
    const { data: person } = await fetchPersonQuery(id);

    return person;
  });
