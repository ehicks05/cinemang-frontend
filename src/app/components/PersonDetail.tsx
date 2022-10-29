import React from 'react';
import { Loading } from '../../core-components';
import { intervalToDuration, parseISO, format, parse } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import chroma from 'chroma-js';
import { useFetchPerson } from '../hooks/useFetchPersons';
import { useParams } from 'react-router-dom';
import { getTmdbImage } from '../../utils';
import PersonStats from './PersonStats';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const PersonDetail = ({ person }: { person: any }) => {
  const posterUrl = person.profile_path
    ? getTmdbImage(person.profile_path, 'original')
    : '/92x138.png';
  const { data: palette, loading, error } = usePalette(posterUrl);

  const birthday = format(parseISO(person.birthday), 'MM-dd-yyyy');
  const age = intervalToDuration({
    end: new Date(),
    start: parse(person.birthday, 'yyyy-MM-dd', new Date()),
  });

  if (error) return <Loading error={error} loading={loading} />;
  if (loading) return <div className="h-full w-full bg-slate-700" />;

  const lessMuted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.7);
  const muted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.95);
  const cardStyle = {
    background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
  };

  const statData = {
    age: String(age.years),
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
            Born {birthday} in {person.place_of_birth}
          </div>
          <div>Age {age.years}</div>
          <div>{person.deathday}</div>
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
      {person.cast_credit.map((c) => (
        <div>
          {c.movie.title} {c.movie.released_at}
        </div>
      ))}
      {person.cast_credit.map((c) => (
        <pre className="text-xs">{JSON.stringify(c, null, 2)}</pre>
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
