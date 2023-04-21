import React from 'react';
import { groupBy } from 'lodash';

import { Film as IFilm } from '../../../types';
import PersonCard from './PersonCard';
import { Palette } from '@/app/hooks/usePalette';

interface Props {
  film: IFilm;
  palette: Palette;
}

const Credits = ({ film, palette }: Props) => {
  const grouped = groupBy(film.crew_credit, c => c.personId);

  return (
    <>
      <h1 className="text-xl font-bold">cast</h1>
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {film.cast_credit
          .sort((c1, c2) => c1.order - c2.order)
          .map(c => (
            <PersonCard
              character={c.character}
              key={c.credit_id}
              name={c.person.name}
              palette={palette}
              personId={c.personId}
              profilePath={c.person.profile_path}
            />
          ))}
      </div>
      <h1 className="text-xl font-bold">crew</h1>
      <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Object.values(grouped)
          .sort((c1, c2) => c2[0].person.popularity - c1[0].person.popularity)
          .map(c => (
            <PersonCard
              jobs={c.map(c => c.job)}
              key={c[0].credit_id}
              name={c[0].person.name}
              palette={palette}
              personId={c[0].personId}
              profilePath={c[0].person.profile_path}
            />
          ))}
      </div>
    </>
  );
};

export default Credits;
