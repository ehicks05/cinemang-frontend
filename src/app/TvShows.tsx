import React, { useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';
import { useTitle, useWindowSize } from 'react-use';
import { Loading } from '../core-components';
import { TvSeries } from '../types';
import { FilmSkeleton, Paginator } from './components';
import { useFetchTvSerieses } from '../hooks/useFetchFilms';
import { getTmdbImage } from '../utils';
import { DEFAULT_PALETTE, Palette, toPalette } from '../hooks/usePalette';
import Show from './components/Show';
import { SHOW_QUERY_PARAMS } from '@/queryParams';

const TvShows = ({ shows }: { shows: TvSeries[] }) => {
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState<Record<number, Palette> | undefined>(
    undefined,
  );

  useMemo(() => {
    const doIt = async () => {
      setLoading(true);
      const palettes = await Promise.all(
        shows.map(async show => {
          const url = getTmdbImage({ bustCache: true, path: show.poster_path });
          const palette = await toPalette(url);
          return { id: show.id, palette };
        }),
      );
      setPalettes(
        palettes.reduce((agg, curr) => ({ ...agg, [curr.id]: curr.palette }), {}),
      );
      setLoading(false);
    };
    if (shows && shows.length !== 0) doIt();
  }, [shows]);

  const { width } = useWindowSize();

  const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 360;

  return (
    <div
      className="grid sm:gap-4"
      style={{
        gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr) )`,
      }}
    >
      {loading && shows.map(show => <FilmSkeleton key={show.id} />)}
      {!loading &&
        shows.map(show => (
          <Show
            show={show}
            key={show.id}
            palette={palettes?.[show.id] || DEFAULT_PALETTE}
          />
        ))}
    </div>
  );
};

const TvShowsWrapper = () => {
  useTitle('Cinemang');
  const [form, setForm] = useQueryParams(SHOW_QUERY_PARAMS);
  const { page } = form;
  const setPage = (page: number) => setForm({ ...form, page });

  const { data, error, isLoading } = useFetchTvSerieses();

  if (error) return <Loading error={error} loading={isLoading} />;
  const shows = data || [];
  const count = 42;

  return (
    <div className="flex flex-col sm:gap-4">
      <Paginator
        count={count}
        isLoading={isLoading}
        pageIndex={page}
        setPage={setPage}
      />
      {isLoading && <Loading loading={isLoading} />}
      {!isLoading && <TvShows shows={shows} key={page} />}
      <Paginator
        count={count}
        isLoading={isLoading}
        pageIndex={page}
        setPage={setPage}
      />
    </div>
  );
};

export default TvShowsWrapper;
