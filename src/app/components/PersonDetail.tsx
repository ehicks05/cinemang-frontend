import React from 'react';
import { Loading } from '../../core-components';
import { intervalToDuration, parseISO, format, parse } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import chroma from 'chroma-js';
import { useFetchPerson } from '../hooks/useFetchPersons';
import { Link, useParams } from 'react-router-dom';
import { getTmdbImage } from '../../utils';
import PersonStats from './PersonStats';
import { Film } from '../../types';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const PersonDetail = ({ person }: { person: any }) => {
  const posterUrl = person.profile_path
    ? getTmdbImage(person.profile_path, 'original')
    : '/92x138.png';
  const { data: palette, loading, error } = usePalette(posterUrl);

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
      className="m-auto flex max-w-screen-lg flex-col gap-4 rounded-lg p-4"
      style={cardStyle}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <img alt="poster" className="sm:h-96 sm:w-64" src={posterUrl} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold">{person.name}</div>
          <div>
            Born {person.birthday} {!person.deathday && `(${age.years})`} {person.place_of_birth && `in ${person.place_of_birth}`}
          </div>
          {person.deathday && <div>Died {person.deathday} at {age.years}</div>}
          <div className="max-w-prose text-justify text-sm">
            {person.biography}
          </div>
          <div>imdb: {person.imdb_id}</div>
          <div className="mt-4 flex flex-col justify-between gap-4">
            <PersonStats bgColor={palette.darkVibrant || ''} data={statData} />
          </div>
        </div>
      </div>

      {/* <Credits film={film} palette={palette} /> */}
      {(person.cast_credit as {character: string; id: string; movie: Film}[])
      .sort((c1, c2) => c2.movie.released_at.localeCompare(c1.movie.released_at))
      .map((c) => (
        <div key={c.credit_id}>
          <div>
            <Link className='text-lg font-bold' to={`/films/${c.movie.id}`}>{c.movie.title}</Link>{" "}
            <span className='text-sm'>{format(parse(c.movie.released_at, 'yyyy-MM-dd', new Date()), 'yyyy')}</span>
          </div>
          <div>{c.character}</div>
        </div>
      ))}
      {(person.crew_credit as {department: string; id: string; job: string; movie: Film}[])
      .sort((c1, c2) => c2.movie.released_at.localeCompare(c1.movie.released_at))
      .map((c) => (
        <div key={c.credit_id}>
          <div>
            <Link className='text-lg font-bold' to={`/films/${c.movie.id}`}>{c.movie.title}</Link>{" "}
            <span className='text-sm'>{format(parse(c.movie.released_at, 'yyyy-MM-dd', new Date()), 'yyyy')}</span>
          </div>
          <div>{c.department} - {c.job}</div>
        </div>
      ))}
      {/* {person.cast_credit.slice(0, 1).map((c) => (
        <pre className="text-xs" key={c.id}>{JSON.stringify(c, null, 2)}</pre>
      ))} */}
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
