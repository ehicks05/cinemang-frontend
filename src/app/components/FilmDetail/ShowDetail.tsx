import React, { useState } from 'react';
import { parseISO, format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useTitle } from 'react-use';
import { FaCalendar, FaClock, FaHeart, FaStar } from 'react-icons/fa';
import { Loading, OriginalImageLink } from '../../../core-components';
import { usePalette } from '@/hooks/usePalette';
import FilmStats from '../MediaStats';
import MediaProviders from '../MediaProviders';
import { Season, Show } from '../../../types';
import { useFetchShow } from '@/hooks/useFetchShows';
import Trailer from '../../../core-components/Trailer';
import Credits from '../../../core-components/Credits';
import { systemDataAtom } from '../../../atoms';
import { getTmdbImage } from '../../../utils';
import { toStats } from '../utils';
import Stat from '../Stat';

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
      <Seasons seasons={show.seasons} />

      <Credits credits={show.credits} palette={palette} />
    </div>
  );
};

const SeasonCard = ({ season }: { season: Season }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-neutral-800 p-4">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">
          {season.season_number}. {season.name}
        </span>
        <span className="flex items-center gap-2">
          <Stat
            icon={FaCalendar}
            label={season.air_date}
            bgColor="#333"
            color="text-green-700"
          />{' '}
          <Stat
            icon={FaHeart}
            label={season.vote_average}
            bgColor="#333"
            color="text-red-600"
          />
        </span>
      </div>
      <div>{season.overview}</div>
      <div className="flex flex-col gap-4">
        {season.episodes.map(episode => (
          <div className="flex flex-col gap-1 bg-neutral-700 p-2">
            <div className="flex items-center justify-between gap-2">
              <span>
                {episode.episode_number}. {episode.name}
              </span>
              <span className="flex  gap-2">
                <Stat
                  icon={FaCalendar}
                  label={episode.air_date}
                  bgColor="#333"
                  color="text-green-700"
                />
                <Stat
                  icon={FaClock}
                  label={episode.runtime || '?'}
                  bgColor="#333"
                  color="text-blue-500"
                />
                <Stat
                  icon={FaHeart}
                  label={episode.vote_average.toFixed(1)}
                  bgColor="#333"
                  color="text-red-600"
                />
                <Stat
                  icon={FaStar}
                  label={episode.vote_count}
                  bgColor="#333"
                  color="text-yellow-500"
                />
              </span>
            </div>
            <div>{episode.overview}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Seasons = ({ seasons }: { seasons: Season[] }) => (
  <div className="flex flex-col gap-4">
    <div className="text-xl font-bold">Seasons</div>
    {seasons.map(season => (
      <SeasonCard season={season} />
    ))}
  </div>
);

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
