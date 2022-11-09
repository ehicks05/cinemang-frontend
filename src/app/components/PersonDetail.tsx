import React, { useState } from 'react';
import { Loading } from '../../core-components';
import { useFetchPerson } from '../hooks/useFetchPersons';
import { useParams } from 'react-router-dom';
import { getTmdbImage } from '../../utils';
import PersonStats from './PersonStats';
import { useTitle } from 'react-use';
import { Person } from '../../types';
import { useAtom } from 'jotai';
import { systemDataAtom } from '../../atoms';
import { truncate } from 'lodash';
import { usePalette } from '../hooks/usePalette';
import BirthAndDeath from './BirthAndDeath';
import PersonCredit from './PersonCredit';

const BIO_LENGTH_CUTOFF = 1280;

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const PersonDetail = ({ person }: { person: Person }) => {
  const [{ genres, languages }] = useAtom(systemDataAtom);
  useTitle(person.name, { restoreOnUnmount: true });
  const profileUrl = getTmdbImage({
    path: person.profile_path,
    width: 'original',
  });

  const [truncateBio, setTruncateBio] = useState(true);
  const bio = truncateBio
    ? truncate(person.biography, { length: BIO_LENGTH_CUTOFF, separator: ' ' })
    : person.biography;

  const { data, isLoading, error } = usePalette(profileUrl);

  if (error) return <Loading error={error} loading={isLoading} />;
  if (isLoading) return <div className="h-full w-full bg-slate-700" />;
  const palette = data!;

  const statData = {
    credits: [...person.cast_credit, ...person.crew_credit].length,
    knownForDepartment: person.known_for_department,
    popularity: nf.format(person.popularity),
  };

  return (
    <div
      className="m-auto flex max-w-screen-lg flex-col gap-4 rounded-lg p-4"
      style={palette.bgStyles}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <img
            alt="poster"
            className="rounded-lg sm:h-96 sm:w-64"
            src={profileUrl}
          />
          <div className="mt-4 flex flex-col justify-between gap-4">
            <PersonStats bgColor={palette.darkVibrant || ''} data={statData} />
            <BirthAndDeath palette={palette} person={person} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">{person.name}</div>
          <div
            className={`flex ${
              person.biography.length > BIO_LENGTH_CUTOFF
                ? 'cursor-pointer'
                : ''
            } flex-col gap-2 text-justify`}
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
          <PersonCredit
            bgColor={palette.darkVibrant}
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
          <PersonCredit
            bgColor={palette.darkVibrant}
            credit={c}
            genres={genres}
            key={c.credit_id}
            languages={languages}
          />
        ))}
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
