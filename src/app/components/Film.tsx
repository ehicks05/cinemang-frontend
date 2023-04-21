import React, { useState } from 'react';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import FilmStats from './FilmStats';
import WatchProviders from './WatchProviders';
import { Film as IFilm } from '../../types';
import { SCALED_IMAGE } from '../../constants';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';
import { toStats } from './utils';
import { Palette } from '@/app/hooks/usePalette';

const Film = ({ film, palette }: { film: IFilm; palette: Palette }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: film.poster_path });
  const year = format(parseISO(film.released_at), 'yyyy');
  const runtime = intervalToDuration({
    end: addMinutes(new Date(), Number(film.runtime)),
    start: new Date(),
  });

  const [truncateOverview, setTruncateOverview] = useState(true);

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4" style={palette?.bgStyles}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            alt="poster"
            height={SCALED_IMAGE.h}
            src={posterUrl}
            width={SCALED_IMAGE.w}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <Link className="text-lg font-bold" to={`/films/${film.id}`}>
              {film.title}
            </Link>
            <span className="text-xs text-gray-300" title={film.released_at}>
              <span className="font-semibold"> {year} </span>
              <span className="whitespace-nowrap">{`${runtime.hours}h ${runtime.minutes}m`}</span>
            </span>
          </div>
          <div>{film.director}</div>
          <div>{film.cast}</div>
          <div className="flex-grow" />
          {film.watch_provider && (
            <WatchProviders selectedIds={film.watch_provider} />
          )}
        </div>
      </div>
      <div className="flex h-full flex-col justify-start gap-4">
        <FilmStats
          bgColor={palette.darkVibrant}
          data={toStats(genres, languages, film)}
        />
        <div
          className="text-justify text-sm"
          onClick={() => setTruncateOverview(!truncateOverview)}
        >
          {truncate(film.overview, {
            length: truncateOverview ? 256 : 1024,
            separator: ' ',
          })}
        </div>
      </div>
    </div>
  );
};

export default Film;
