import React, { FC, useEffect } from 'react';
import { Loading } from '../core-components';
import { SearchForm } from './components';
import { useFetchSystemData } from './hooks/useFetchSystemData';
import { useAtom } from 'jotai';
import { systemDataAtom } from '../atoms';
import FilmsWrapper from './Films';

const Home: FC = () => {
  const { data, error, isLoading } = useFetchSystemData();

  const [, setSystemData] = useAtom(systemDataAtom);

  useEffect(() => {
    if (data) setSystemData(data);
  }, [data]);

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!data) {
    return <Loading error={'systemData is undefined'} loading={isLoading} />;
  }
  const { genres, languages, watchProviders } = data;

  if (!genres?.length || !languages?.length || !watchProviders?.length)
    return <div>Missing system data</div>;

  return (
    <div className="flex flex-col gap-4">
      <SearchForm />
      <FilmsWrapper />
    </div>
  );
};

export default Home;
