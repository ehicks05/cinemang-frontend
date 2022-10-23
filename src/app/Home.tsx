import React, { FC } from 'react';
import { Loading } from '../core-components';
import { PAGE_SIZE } from '../constants';
import { Language, Genre, WatchProvider } from '../types';
import { Film, Paginator, SearchForm } from './components';
import { useFetchSystemData } from './hooks/useFetchSystemData';
import { useSearchFilms } from './hooks/useFetchFilms';
import { useQueryParams } from 'use-query-params';

const Home: FC = () => {
  const { data, error, isLoading } = useFetchSystemData();

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!data) {
    return <Loading error={'systemData is undefined'} loading={isLoading} />;
  }
  const { genres, languages, watchProviders } = data;
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
  const [form, setForm] = useQueryParams();
  const { page } = form;
  const setPage = (page: number) => setForm({ ...form, page });

  const { data, error, isLoading } = useSearchFilms({ page });

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!data) {
    return <Loading error={'films are not defined'} loading={isLoading} />;
  }
  const { films, count } = data;

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
              key={film.id}
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
