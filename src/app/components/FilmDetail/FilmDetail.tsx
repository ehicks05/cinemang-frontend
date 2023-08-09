import React from 'react';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useTitle } from 'react-use';
import { Loading, OriginalImageLink } from '../../../core-components';
import { usePalette } from '@/hooks/usePalette';
import FilmStats from '../MediaStats';
import MediaProviders from '../MediaProviders';
import { Film as IFilm } from '../../../types';
import { useFetchFilm } from '@/hooks/useFetchFilms';
import Trailer from '../../../core-components/Trailer';
import Credits from '../../../core-components/Credits';
import { systemDataAtom } from '../../../atoms';
import { getTmdbImage } from '../../../utils';
import { toStats } from '../utils';

const FilmDetail = ({ film }: { film: IFilm }) => {
  useTitle(film.title, { restoreOnUnmount: true });
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: film.poster_path, width: 'w500' });
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
      className="m-auto flex max-w-screen-lg flex-col gap-4 p-4 sm:rounded-lg"
      style={palette.bgStyles}
    >
      <div>
        <div className="text-2xl font-semibold sm:text-3xl">{film.title}</div>
        <div className="text-sm text-gray-300">
          <span title={film.released_at}>{year}</span>
          {' • '}
          <span>{`${runtime.hours}h ${runtime.minutes}m`}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              alt="poster"
              className="w-full rounded-lg sm:w-80 md:w-96"
              src={posterUrl}
            />
            <OriginalImageLink path={film.poster_path} />
          </div>
          <div className="mt-4 flex flex-col justify-between gap-4">
            <FilmStats
              bgColor={palette.darkVibrant}
              data={toStats(genres, languages, film)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Trailer movieId={film.id} />
            <div>Director: {film.director}</div>
            <div>Starring: {film.cast}</div>
            <div className="text-justify text-sm sm:text-base">{film.overview}</div>
          </div>

          {film.watch_provider.length > 0 && (
            <MediaProviders selectedIds={film.watch_provider} />
          )}
        </div>
      </div>
      <Credits credits={film.credits} palette={palette} />
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
