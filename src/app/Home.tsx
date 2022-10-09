import React, { FC, useState } from 'react';
import { Loading } from '../core-components';
import { PAGE_SIZE } from '../constants';
import { Language, Genre, WatchProvider } from '../types';
import { Film, Paginator, SearchForm } from './components';
import { useFetchSystemData } from './hooks/useFetchSystemData';
import { useFetchFilms } from './hooks/useFetchFilms';

const Home: FC = () => {
  const {
    data: { genres, languages, watchProviders },
    error,
    loading,
  } = useFetchSystemData();

  if (error || loading) return <Loading error={error} loading={loading} />;
  if (!genres?.length || !languages?.length || !watchProviders?.length)
    return <div>Missing system data</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <SearchForm
          genres={genres}
          languages={languages}
          watchProviders={watchProviders}
        />
      </div>
      <Films
        genres={genres}
        languages={languages}
        watchProviders={watchProviders}
      />
    </div>
  );
};

const Films: FC<{
  genres: Genre[];
  languages: Language[];
  watchProviders: WatchProvider[];
}> = ({ languages, genres, watchProviders }) => {
  const [page, setPage] = useState(0);
  const { data, error, loading } = useFetchFilms({ page });
  const { films, count } = data;

  if (error || loading) return <Loading error={error} loading={loading} />;
  if (!films || films.length === 0) return <div>No films</div>;

  return (
    <>
      <Paginator
        count={count}
        page={page}
        pageSize={PAGE_SIZE}
        setPage={setPage}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
        {films.map((film) => {
          return (
            <Film
              film={film}
              genres={genres}
              key={film.tmdb_id}
              languages={languages}
              watchProviders={watchProviders}
            />
          );
        })}
      </div>
      <Paginator
        count={count}
        page={page}
        pageSize={PAGE_SIZE}
        setPage={setPage}
      />
    </>
  );
};

export default Home;
