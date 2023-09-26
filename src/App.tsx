import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAtom } from 'jotai';
import { Header, Footer, Loading } from './core-components';
import { Home } from './app/index';
import { FilmDetail, PersonDetail } from './app/components';
import { useFetchSystemData } from './hooks/useFetchSystemData';
import { systemDataAtom } from './atoms';
import Shows from './app/Shows';
import ShowDetail from './app/components/FilmDetail/ShowDetail';

function App() {
  const { data, error, isLoading } = useFetchSystemData();

  const [, setSystemData] = useAtom(systemDataAtom);

  useEffect(() => {
    if (data) setSystemData(data);
  }, [data]);

  const systemDataLoaded =
    data &&
    data.genres.length > 0 &&
    data.languages.length > 0 &&
    data.providers.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tr from-indigo-900 to-green-900 text-gray-50">
      <Header />
      <div className="flex h-full flex-grow flex-col pb-4 sm:px-4">
        {!isLoading && (error || !systemDataLoaded) && (
          <Loading error={error || 'something went wrong'} loading={false} />
        )}
        {systemDataLoaded && (
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Shows />} path="/tv" />
            <Route element={<FilmDetail />} path="/films/:id" />
            <Route element={<ShowDetail />} path="/tv/:id" />
            <Route element={<PersonDetail />} path="/people/:id" />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
