import React from 'react';
import { parseISO, format } from 'date-fns';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import MediaStats from './MediaStats';
import MediaProviders from './MediaProviders';
import { Show } from '../../types';
import { SCALED_IMAGE } from '../../constants';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';
import { toStats } from './utils';
import { Palette } from '@/hooks/usePalette';

const ShowCard = ({ show, palette }: { show: Show; palette: Palette }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);

  const posterUrl = getTmdbImage({ path: show.poster_path });
  const firstYear = format(parseISO(show.first_air_date), 'yyyy');
  const lastYear = format(parseISO(show.last_air_date), 'yyyy');
  const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;
  const overview = truncate(show.overview, { length: 256, separator: ' ' });

  return (
    <Link to={`/tv/${show.id}`}>
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
              <span className="text-lg font-bold">{show.name}</span>
              <span className="text-xs text-gray-300">
                <span className="font-semibold"> {years}</span>
              </span>
            </div>
            <div>{show.created_by_id}</div>
            <div>Status: {show.status}</div>
            <div>
              {show.cast.split(', ').map(name => (
                <div>{name}</div>
              ))}
            </div>
            <div className="flex-grow" />
            {show.providers && <MediaProviders selectedIds={show.providers} />}
          </div>
        </div>
        <div className="flex h-full flex-col justify-start gap-4">
          <MediaStats
            bgColor={palette.darkVibrant}
            data={toStats(genres, languages, show)}
          />
          <div className="text-justify text-sm">{overview}</div>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
