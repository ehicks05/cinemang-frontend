import React, { useMemo, useState } from 'react';
import { Loading } from '../core-components';
import { Film as IFilm } from '../types';
import { Film, FilmSkeleton, Paginator } from './components';
import { useSearchFilms } from './hooks/useFetchFilms';
import { useQueryParams } from 'use-query-params';
import Vibrant from 'node-vibrant';
import { PaletteColors } from '@lauriys/react-palette';
import { getTmdbImage } from '../utils';
import { useWindowSize } from 'react-use';

const toPalette = async (url: string) => {
  const img = new Image();
  img.crossOrigin = 'cinemang.ehicks.net';
  img.src = url;
  const p = await Vibrant.from(img).getPalette();
  return {
    darkMuted: p.DarkMuted?.getHex(),
    darkVibrant: p.DarkVibrant?.getHex(),
  };
};

const Films = ({ films }: { films: IFilm[] }) => {
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState<
    Record<number, PaletteColors> | undefined
  >(undefined);

  useMemo(() => {
    const doIt = async () => {
      setLoading(true);
      const palettes = await Promise.all(
        films.map(async (film) => {
          const url = `${getTmdbImage(
            film.poster_path,
          )}?cache-buster=${new Date().valueOf()}`;
          const palette = await toPalette(url);
          return { id: film.id, palette };
        }),
      );
      setPalettes(
        palettes.reduce(
          (agg, curr) => ({ ...agg, [curr.id]: curr.palette }),
          {},
        ),
      );
      setLoading(false);
    };
    if (films && films.length !== 0) doIt();
  }, [films]);

  const { width } = useWindowSize();

  const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 360;

  return (
    <div
      className={`grid gap-4`}
      style={{
        gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr) )`,
      }}
    >
      {loading &&
        films.map((film) => {
          return <FilmSkeleton key={film.id} />;
        })}
      {!loading &&
        films.map((film) => {
          return (
            <Film
              film={film}
              key={film.id}
              palette={
                palettes?.[film.id] || {
                  darkMuted: '262626',
                  darkVibrant: '363636',
                }
              }
            />
          );
        })}
    </div>
  );
};

const FilmsWrapper = () => {
  const [form, setForm] = useQueryParams();
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
