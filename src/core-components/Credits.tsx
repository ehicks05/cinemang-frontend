import React from 'react';
import { groupBy } from 'lodash';

import { Credit } from '../types';
import PersonCard from './PersonCard';
import { Palette } from '@/hooks/usePalette';

interface Props {
  credits: Credit[];
  palette: Palette;
}

const Credits = ({ credits, palette }: Props) => {
  const cast = credits.filter(c => c.character);
  const crew = credits.filter(c => c.job);
  const groupedCrew = groupBy(crew, c => c.person_id);

  return (
    <>
      <h1 className="text-xl font-bold">Cast</h1>
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {cast
          .sort((c1, c2) => c1.order - c2.order)
          .map(c => (
            <PersonCard
              character={c.character}
              key={c.credit_id}
              name={c.person.name}
              palette={palette}
              personId={c.person.id}
              profilePath={c.person.profile_path}
            />
          ))}
      </div>
      <h1 className="text-xl font-bold">Crew</h1>
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Object.values(groupedCrew)
          .sort((c1, c2) => c2[0].person.popularity - c1[0].person.popularity)
          .map(c => (
            <PersonCard
              jobs={c.map(c => c.job)}
              key={c[0].credit_id}
              name={c[0].person.name}
              palette={palette}
              personId={c[0].person.id}
              profilePath={c[0].person.profile_path}
            />
          ))}
      </div>
    </>
  );
};

export default Credits;
