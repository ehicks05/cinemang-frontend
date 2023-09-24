import React from 'react';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import MediaStats from './MediaStats';
import MediaProviders from './MediaProviders';
import { Film as IFilm } from '../../types';
import { SCALED_IMAGE } from '../../constants';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';
import { toStats } from './utils';
import { Palette } from '@/hooks/usePalette';

const Film = ({ film, palette }: { film: IFilm; palette: Palette }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: film.poster_path });
  const year = format(parseISO(film.released_at), 'yyyy');
  const runtime = intervalToDuration({
    end: addMinutes(new Date(), Number(film.runtime)),
    start: new Date(),
  });
  const overview = truncate(film.overview, { length: 256, separator: ' ' });

  return (
    <Link to={`/films/${film.id}`}>
      <div
        className="flex flex-col gap-4 p-4 sm:rounded-lg"
        style={palette?.bgStyles}
      >
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
              <span className="text-lg font-bold">{film.title}</span>
              <span className="text-xs text-gray-300" title={film.released_at}>
                <span className="font-semibold"> {year} </span>
                <span className="whitespace-nowrap">{`${runtime.hours}h ${runtime.minutes}m`}</span>
              </span>
            </div>
            <div>{film.director}</div>
            <div>
              {film.cast.split(', ').map(name => (
                <div>{name}</div>
              ))}
            </div>
            <div className="flex-grow" />
            {film.providers && <MediaProviders selectedIds={film.providers} />}
          </div>
        </div>
        <div className="flex h-full flex-col justify-start gap-4">
          <MediaStats
            bgColor={palette.darkVibrant}
            data={toStats(genres, languages, film)}
          />
          <div className="text-justify text-sm">{overview}</div>
        </div>
      </div>
    </Link>
  );
};

export default Film;
