import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAtom } from 'jotai';
import { Header, Footer, Loading } from './core-components';
import { Home } from './app/index';
import { FilmDetail, PersonDetail } from './app/components';
import { useFetchSystemData } from './hooks/useFetchSystemData';
import { systemDataAtom } from './atoms';

function App() {
  const { data, error, isLoading } = useFetchSystemData();

  const [, setSystemData] = useAtom(systemDataAtom);

  useEffect(() => {
    if (data) setSystemData(data);
  }, [data]);

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!data) {
    return <Loading error="systemData is undefined" loading={isLoading} />;
  }
  const { genres, languages, watchProviders } = data;

  if (!genres?.length || !languages?.length || !watchProviders?.length)
    return <div>Missing system data</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tr from-indigo-900 to-green-900 text-gray-50">
      <Header />
      <div className="flex h-full flex-grow flex-col p-4 pt-0">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<FilmDetail />} path="/films/:id" />
          <Route element={<PersonDetail />} path="/people/:id" />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
