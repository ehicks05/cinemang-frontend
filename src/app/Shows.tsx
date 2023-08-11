import React, { useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';
import { useTitle, useWindowSize } from 'react-use';
import { Loading } from '../core-components';
import { Show } from '../types';
import { MediaSkeleton, Paginator, SearchForm } from './components';
import { useSearchShows } from '../hooks/useFetchShows';
import { getTmdbImage } from '../utils';
import { DEFAULT_PALETTE, Palette, toPalette } from '../hooks/usePalette';
import ShowCard from './components/Show';
import { SHOW_QUERY_PARAMS } from '@/queryParams';

const Shows = ({ shows }: { shows: Show[] }) => {
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
      {loading && shows.map(show => <MediaSkeleton key={show.id} />)}
      {!loading &&
        shows.map(show => (
          <ShowCard
            show={show}
            key={show.id}
            palette={palettes?.[show.id] || DEFAULT_PALETTE}
          />
        ))}
    </div>
  );
};

const ShowsWrapper = () => {
  useTitle('Cinemang');
  const [form, setForm] = useQueryParams(SHOW_QUERY_PARAMS);
  const { page } = form;
  const setPage = (page: number) => setForm({ ...form, page });

  const { data, error, isLoading } = useSearchShows({ page });

  if (error) return <Loading error={error} loading={isLoading} />;
  const { shows, count } = data || {};

  return (
    <div className="flex flex-col sm:gap-4">
      <SearchForm />
      <div className="flex flex-col sm:gap-4">
        <Paginator
          count={count}
          isLoading={isLoading}
          pageIndex={page}
          setPage={setPage}
        />
        {isLoading && <Loading loading={isLoading} />}
        {!isLoading && <Shows shows={shows || []} key={page} />}
        <Paginator
          count={count}
          isLoading={isLoading}
          pageIndex={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default ShowsWrapper;
