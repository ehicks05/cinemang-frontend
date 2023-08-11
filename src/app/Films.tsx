import React, { useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';
import { useTitle, useWindowSize } from 'react-use';
import { Loading } from '../core-components';
import { Film as IFilm } from '../types';
import { Film, MediaSkeleton, Paginator } from './components';
import { useSearchFilms } from '../hooks/useFetchFilms';
import { getTmdbImage } from '../utils';
import { DEFAULT_PALETTE, Palette, toPalette } from '../hooks/usePalette';
import { MOVIE_QUERY_PARAMS } from '@/queryParams';

const Films = ({ films }: { films: IFilm[] }) => {
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState<Record<number, Palette> | undefined>(
    undefined,
  );

  useMemo(() => {
    const doIt = async () => {
      setLoading(true);
      const palettes = await Promise.all(
        films.map(async film => {
          const url = getTmdbImage({ path: film.poster_path });
          const palette = await toPalette(url);
          return { id: film.id, palette };
        }),
      );
      setPalettes(
        palettes.reduce((agg, curr) => ({ ...agg, [curr.id]: curr.palette }), {}),
      );
      setLoading(false);
    };
    if (films && films.length !== 0) doIt();
  }, [films]);

  const { width } = useWindowSize();

  const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 360;

  return (
    <div
      className="grid sm:gap-4"
      style={{
        gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr) )`,
      }}
    >
      {loading && films.map(film => <MediaSkeleton key={film.id} />)}
      {!loading &&
        films.map(film => (
          <Film
            film={film}
            key={film.id}
            palette={palettes?.[film.id] || DEFAULT_PALETTE}
          />
        ))}
    </div>
  );
};

const FilmsWrapper = () => {
  useTitle('Cinemang');
  const [form, setForm] = useQueryParams(MOVIE_QUERY_PARAMS);
  const { page } = form;
  const setPage = (page: number) => setForm({ ...form, page });

  const { data, error, isLoading } = useSearchFilms({ page });

  if (error) return <Loading error={error} loading={isLoading} />;
  const { films, count } = data || {};

  return (
    <>
      <Paginator
        count={count}
        isLoading={isLoading}
        pageIndex={page}
        setPage={setPage}
      />
      {isLoading && <Loading loading={isLoading} />}
      {!isLoading && <Films films={films || []} key={page} />}
      <Paginator
        count={count}
        isLoading={isLoading}
        pageIndex={page}
        setPage={setPage}
      />
    </>
  );
};

export default FilmsWrapper;
