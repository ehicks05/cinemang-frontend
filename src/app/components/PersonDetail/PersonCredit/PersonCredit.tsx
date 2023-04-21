import React from 'react';
import { parseISO, format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { pick } from 'lodash';
import * as HoverCard from '@radix-ui/react-hover-card';
import { CastCredit, CrewCredit, Genre, Language } from '../../../../types';
import FilmStats from '../../FilmStats';
import { toStats } from '../../utils';
import HoverFilm from './HoverFilm';

interface Props {
  bgColor: string;
  credit: CastCredit | CrewCredit;
  genres: Genre[];
  languages: Language[];
}

const PersonCredit = ({ bgColor, genres, languages, credit }: Props) => {
  const { width } = useWindowSize();
  const year = format(parseISO(credit.movie.released_at), 'yyyy');

  const creditUi =
    'character' in credit ? (
      <span>{credit.character}</span>
    ) : (
      <span>
        {credit.department} - {credit.job}
      </span>
    );

  return (
    <HoverCard.Root openDelay={350}>
      <div
        className="flex flex-col justify-between gap-2 rounded border p-2 sm:flex-row sm:items-center"
        key={credit.credit_id}
        style={{ borderColor: bgColor }}
      >
        <div className="flex flex-col items-baseline gap-2 sm:flex-row">
          <span className="hidden text-xs sm:inline">{year} </span>
          <div className="flex flex-col items-baseline gap-2 lg:flex-row">
            <span className="flex items-baseline gap-2">
              <HoverCard.Trigger asChild>
                <Link className="" to={`/films/${credit.movie.id}`}>
                  <span className="font-bold sm:text-lg">{credit.movie.title}</span>
                  <span className="inline text-xs sm:hidden"> {year}</span>
                </Link>
              </HoverCard.Trigger>
            </span>{' '}
            {creditUi}
          </div>
        </div>
        <div>
          <FilmStats
            autoWidth={width < 640}
            bgColor={bgColor}
            data={pick(toStats(genres, languages, credit.movie), [
              'voteAverage',
              'voteCount',
            ])}
          />
        </div>
      </div>
      <HoverCard.Portal>
        <HoverCard.Content className="HoverCardContent">
          <HoverFilm id={credit.movieId} />
          <HoverCard.Arrow className="text-gray-700" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default PersonCredit;
