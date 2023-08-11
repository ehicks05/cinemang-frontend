import React, { useMemo, useState } from 'react';
import { useTitle } from 'react-use';
import {
  Loading,
  MediaLayout,
  MediaSkeleton,
  MediaSkeletons,
} from '../core-components';
import { Film as IFilm } from '../types';
import { Film, Paginator } from './components';
import { useSearchFilms } from '../hooks/useFetchFilms';
import { getTmdbImage } from '../utils';
import { DEFAULT_PALETTE, Palette, toPalette } from '../hooks/usePalette';

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
    if (films.length !== 0) doIt();
  }, [films]);

  return (
    <MediaLayout>
      {loading && films.map(film => <MediaSkeleton key={film.id} />)}
      {!loading &&
        films.map(film => (
          <Film
            film={film}
            key={film.id}
            palette={palettes?.[film.id] || DEFAULT_PALETTE}
          />
        ))}
    </MediaLayout>
  );
};

const FilmsWrapper = () => {
  useTitle('Cinemang');
  const { data, error, isLoading } = useSearchFilms();

  if (error) return <Loading error={error} loading={isLoading} />;
  const { films, count } = data || {};

  return (
    <>
      <Paginator count={count} isLoading={isLoading} />
      {isLoading && <MediaSkeletons />}
      {!isLoading && <Films films={films || []} />}
      <Paginator count={count} isLoading={isLoading} />
    </>
  );
};

export default FilmsWrapper;
