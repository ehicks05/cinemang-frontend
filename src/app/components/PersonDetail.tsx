import React, { useState } from 'react';
import { Loading } from '../../core-components';
import { intervalToDuration, parseISO, format } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import chroma from 'chroma-js';
import { useFetchPerson } from '../hooks/useFetchPersons';
import { Link, useParams } from 'react-router-dom';
import { getTmdbImage } from '../../utils';
import PersonStats from './PersonStats';
import { useTitle } from 'react-use';
import { CastCredit, CrewCredit, Genre, Language, Person } from '../../types';
import FilmStats from './FilmStats';
import { toStats } from './utils';
import { useAtom } from 'jotai';
import { systemDataAtom } from '../../atoms';
import { pick, truncate } from 'lodash';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const PersonDetail = ({ person }: { person: Person }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);
  useTitle(person.name, { restoreOnUnmount: true });
  const posterUrl = person.profile_path
    ? getTmdbImage(person.profile_path, 'original')
    : '/92x138.png';
  const { data: palette, loading, error } = usePalette(posterUrl);
  const [truncateBio, setTruncateBio] = useState(true);
  const bio = truncateBio
    ? truncate(person.biography, { length: 1280 })
    : person.biography;

  const age = intervalToDuration({
    end: person.deathday ? parseISO(person.deathday) : new Date(),
    start: parseISO(person.birthday),
  });

  if (error) return <Loading error={error} loading={loading} />;
  if (loading) return <div className="h-full w-full bg-slate-700" />;

  const lessMuted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.7);
  const muted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.95);
  const cardStyle = {
    background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
  };

  const statData = {
    knownForDepartment: person.known_for_department,
    popularity: nf.format(person.popularity),
  };

  return (
    <div
      className="m-auto flex max-w-screen-xl flex-col gap-4 rounded-lg p-4"
      style={cardStyle}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <img alt="poster" className="sm:h-96 sm:w-64" src={posterUrl} />
          <div className="mt-4 flex flex-col justify-between gap-4">
            <PersonStats bgColor={palette.darkVibrant || ''} data={statData} />
            {person.birthday && (
              <div>
                <div>Born</div>
                <div>
                  {person.birthday} {!person.deathday && `(${age.years})`}
                </div>
                <div>{person.place_of_birth && person.place_of_birth}</div>
              </div>
            )}

            {person.deathday && (
              <div>
                Died
                <div>
                  {person.deathday} ({age.years})
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">{person.name}</div>
          <div
            className="max-w-prose cursor-pointer text-justify text-sm"
            onClick={() => setTruncateBio(!truncateBio)}
          >
            {bio}
          </div>
        </div>
      </div>

      {person.cast_credit
        .sort((c1, c2) =>
          c2.movie.released_at.localeCompare(c1.movie.released_at),
        )
        .map((c) => (
          <Credit
            bgColor={palette.darkVibrant || ''}
            credit={c}
            genres={genres}
            key={c.credit_id}
            languages={languages}
          />
        ))}
      {person.crew_credit
        .sort((c1, c2) =>
          c2.movie.released_at.localeCompare(c1.movie.released_at),
        )
        .map((c) => (
          <Credit
            bgColor={palette.darkVibrant || ''}
            credit={c}
            genres={genres}
            key={c.credit_id}
            languages={languages}
          />
        ))}
    </div>
  );
};

const Credit = ({
  bgColor,
  genres,
  languages,
  credit,
}: {
  bgColor: string;
  credit: CastCredit | CrewCredit;
  genres: Genre[];
  languages: Language[];
}) => {
  return (
    <div key={credit.credit_id}>
      <Link className="text-lg font-bold" to={`/films/${credit.movie.id}`}>
        {credit.movie.title}
      </Link>{' '}
      <span className="text-sm">
        {format(parseISO(credit.movie.released_at), 'yyyy')}
      </span>{' '}
      {'character' in credit && <span>{credit.character}</span>}
      {'department' in credit && (
        <span>
          {credit.department} - {credit.job}
        </span>
      )}
      <FilmStats
        bgColor={bgColor}
        data={pick(toStats(genres, languages, credit.movie), [
          'voteAverage',
          'voteCount',
        ])}
      />
    </div>
  );
};

const PersonDetailWrapper = () => {
  const { id } = useParams();

  const { data: person, error, isLoading } = useFetchPerson(Number(id) || 0);

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!person) {
    return <Loading error={'person not found'} loading={isLoading} />;
  }

  return <PersonDetail person={person} />;
};

export default PersonDetailWrapper;
