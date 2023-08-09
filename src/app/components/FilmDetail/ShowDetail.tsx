import React from 'react';
import { parseISO, format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useTitle } from 'react-use';
import { Loading, OriginalImageLink } from '../../../core-components';
import { usePalette } from '@/hooks/usePalette';
import FilmStats from '../MediaStats';
import MediaProviders from '../MediaProviders';
import { Show } from '../../../types';
import { useFetchShow } from '@/hooks/useFetchShows';
import Trailer from '../../../core-components/Trailer';
import Credits from '../../../core-components/Credits';
import { systemDataAtom } from '../../../atoms';
import { getTmdbImage } from '../../../utils';
import { toStats } from '../utils';

const ShowDetail = ({ show }: { show: Show }) => {
  useTitle(show.name, { restoreOnUnmount: true });
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: show.poster_path, width: 'w500' });
  const firstYear = format(parseISO(show.first_air_date), 'yyyy');
  const lastYear = format(parseISO(show.last_air_date), 'yyyy');
  const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

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
        <div className="text-2xl font-semibold sm:text-3xl">{show.name}</div>
        <div className="text-sm text-gray-300">
          <span>{years}</span>
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
            <OriginalImageLink path={show.poster_path} />
          </div>
          <div className="mt-4 flex flex-col justify-between gap-4">
            <FilmStats
              bgColor={palette.darkVibrant}
              data={toStats(genres, languages, show)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Trailer showId={show.id} />
            <div>Starring: {show.cast}</div>
            <div className="text-justify text-sm sm:text-base">{show.overview}</div>
          </div>

          {show.providers.length > 0 && (
            <MediaProviders selectedIds={show.providers} />
          )}
        </div>
      </div>

      <pre className="text-xs">{JSON.stringify(show.seasons, null, 2)}</pre>

      <Credits credits={show.credits} palette={palette} />
    </div>
  );
};

const Wrapper = () => {
  const { id } = useParams();

  const { data: show, error, isLoading } = useFetchShow(Number(id) || 0);

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!show) {
    return <Loading error="shows are not defined" loading={isLoading} />;
  }

  return <ShowDetail show={show} />;
};

export default Wrapper;
