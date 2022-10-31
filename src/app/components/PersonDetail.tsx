import React, { useState } from 'react';
import { Loading } from '../../core-components';
import { intervalToDuration, parseISO, format } from 'date-fns';
import { PaletteColors, usePalette } from '@lauriys/react-palette';
import chroma from 'chroma-js';
import { useFetchPerson } from '../hooks/useFetchPersons';
import { Link, useParams } from 'react-router-dom';
import { getTmdbImage } from '../../utils';
import PersonStats from './PersonStats';
import { useTitle, useWindowSize } from 'react-use';
import { CastCredit, CrewCredit, Genre, Language, Person } from '../../types';
import FilmStats from './FilmStats';
import { toStats } from './utils';
import { useAtom } from 'jotai';
import { systemDataAtom } from '../../atoms';
import { pick, truncate } from 'lodash';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const BirthAndDeath = ({
  person,
  palette,
}: {
  palette: PaletteColors;
  person: Person;
}) => {
  const age = intervalToDuration({
    end: person.deathday ? parseISO(person.deathday) : new Date(),
    start: parseISO(person.birthday),
  });

  return person.birthday || person.deathday ? (
    <div
      className="rounded border p-2"
      style={{ borderColor: palette.darkVibrant }}
    >
      {person.birthday && (
        <div>
          <div className="font-bold">Born</div>
          <div>
            {person.birthday} {!person.deathday && `(${age.years})`}
          </div>
          <div>{person.place_of_birth && person.place_of_birth}</div>
        </div>
      )}
      {person.deathday && (
        <div>
          <div className="font-bold">Died</div>
          <div>
            {person.deathday} ({age.years})
          </div>
        </div>
      )}
    </div>
  ) : null;
};

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
          <img
            alt="poster"
            className="rounded-lg sm:h-96 sm:w-64"
            src={posterUrl}
          />
          <div className="mt-4 flex flex-col justify-between gap-4">
            <PersonStats bgColor={palette.darkVibrant || ''} data={statData} />
            <BirthAndDeath palette={palette} person={person} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">{person.name}</div>
          <div
            className="flex cursor-pointer flex-col gap-2 text-justify"
            onClick={() => setTruncateBio(!truncateBio)}
          >
            {bio.split('\n').map((b) => (
              <div key={b}>{b}</div>
            ))}
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
  const { width } = useWindowSize();
  return (
    <div
      className="flex flex-col items-center justify-between gap-2 rounded border p-2 sm:flex-row"
      key={credit.credit_id}
      style={{ borderColor: bgColor }}
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <span className="flex flex-col items-center gap-2 sm:flex-row">
          <span className="text-xs">
            {format(parseISO(credit.movie.released_at), 'yyyy')}
          </span>{' '}
          <Link
            className="text-center text-lg font-bold"
            to={`/films/${credit.movie.id}`}
          >
            {credit.movie.title}
          </Link>{' '}
        </span>
        {'character' in credit && <span>{credit.character}</span>}
        {'department' in credit && (
          <span>
            {credit.department} - {credit.job}
          </span>
        )}
      </div>
      <div className="">
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
