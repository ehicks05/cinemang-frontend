import React, { useState } from 'react';
import { parseISO, format } from 'date-fns';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import FilmStats from './FilmStats';
import WatchProviders from './WatchProviders';
import { TvSeries } from '../../types';
import { SCALED_IMAGE } from '../../constants';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';
import { toStats } from './utils';
import { Palette } from '@/hooks/usePalette';

const Show = ({ show, palette }: { show: TvSeries; palette: Palette }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: show.poster_path });
  const firstYear = format(parseISO(show.first_air_date), 'yyyy');
  const lastYear = format(parseISO(show.last_air_date), 'yyyy');
  const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

  const [truncateOverview, setTruncateOverview] = useState(true);

  return (
    <div className="flex flex-col gap-4 p-4 sm:rounded-lg" style={palette?.bgStyles}>
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
            <Link className="text-lg font-bold" to={`/films/${show.id}`}>
              {show.name}
            </Link>
            <span className="text-xs text-gray-300">
              <span className="font-semibold"> {years}</span>
            </span>
          </div>
          <div>{show.created_by_id}</div>
          <div>{show.cast}</div>
          <div className="flex-grow" />
          {show.watch_provider && (
            <WatchProviders selectedIds={show.watch_provider} />
          )}
        </div>
      </div>
      <div className="flex h-full flex-col justify-start gap-4">
        <FilmStats
          bgColor={palette.darkVibrant}
          data={toStats(genres, languages, show)}
        />
        <div
          className="text-justify text-sm"
          onClick={() => setTruncateOverview(!truncateOverview)}
        >
          {truncate(show.overview, {
            length: truncateOverview ? 256 : 1024,
            separator: ' ',
          })}
        </div>
      </div>
    </div>
  );
};

export default Show;