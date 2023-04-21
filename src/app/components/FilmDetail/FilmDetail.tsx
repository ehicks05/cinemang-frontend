import React from 'react';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useTitle } from 'react-use';
import { Loading } from '../../../core-components';
import { usePalette } from '@/app/hooks/usePalette';
import FilmStats from '../FilmStats';
import WatchProviders from '../WatchProviders';
import { Film as IFilm } from '../../../types';
import { useFetchFilm } from '@/app/hooks/useFetchFilms';
import Trailers from './Trailers';
import Credits from './Credits';
import { systemDataAtom } from '../../../atoms';
import { getTmdbImage } from '../../../utils';
import { toStats } from '../utils';

const FilmDetail = ({ film }: { film: IFilm }) => {
  useTitle(film.title, { restoreOnUnmount: true });
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: film.poster_path, width: 'original' });
  const year = format(parseISO(film.released_at), 'yyyy');
  const runtime = intervalToDuration({
    end: addMinutes(new Date(), Number(film.runtime)),
    start: new Date(),
  });

  const { data, isLoading, error } = usePalette(posterUrl);

  if (error) return <Loading error={error} loading={isLoading} />;
  if (isLoading) return <div className="h-full w-full bg-slate-700" />;
  const palette = data!;

  return (
    <div
      className="m-auto flex max-w-screen-lg flex-col gap-4 rounded-lg p-4"
      style={palette.bgStyles}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <img alt="poster" className="rounded-lg sm:h-96 sm:w-64" src={posterUrl} />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="text-2xl font-semibold">{film.title}</span>{' '}
            <span className="text-xs text-gray-300" title={film.released_at}>
              <span className="font-semibold"> {year} </span>
              <span className="whitespace-nowrap">{`${runtime.hours}h ${runtime.minutes}m`}</span>
            </span>
          </div>
          <div>{film.director}</div>
          <div>{film.cast}</div>
          <div className="text-justify text-sm">{film.overview}</div>
          <div className="mt-4 flex flex-col justify-between gap-4">
            <FilmStats
              bgColor={palette.darkVibrant}
              data={toStats(genres, languages, film)}
            />
          </div>
          {film.watch_provider.length > 0 && (
            <div className="mt-4">
              <WatchProviders selectedIds={film.watch_provider} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">trailers</h1>
        <Trailers movieId={film.id} palette={palette} />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">more like this</h1>
        TODO
      </div>
      <Credits film={film} palette={palette} />
    </div>
  );
};

const FilmDetailWrapper = () => {
  const { id } = useParams();

  const { data: film, error, isLoading } = useFetchFilm(Number(id) || 0);

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!film) {
    return <Loading error="films are not defined" loading={isLoading} />;
  }

  return <FilmDetail film={film} />;
};

export default FilmDetailWrapper;
