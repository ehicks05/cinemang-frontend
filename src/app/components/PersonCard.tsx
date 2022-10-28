import { PaletteColors } from '@lauriys/react-palette';
import React from 'react';
import { getTmdbImage } from '../../utils';

interface Props {
  character?: string;
  creditId: string;
  jobs?: string[];
  name: string;
  palette: PaletteColors;
  profilePath?: string;
}

const toInitials = (name: string) => {
  const parts = name.split(' ');
  return [parts.at(0), parts.at(-1)]
    .map((part) => (part || '').slice(0, 1))
    .join('');
};

const PersonCard = ({
  palette,
  character,
  // creditId,
  jobs,
  name,
  profilePath,
}: Props) => {
  const profile = profilePath
    ? getTmdbImage(profilePath)
    : `https://via.placeholder.com/300x450/${palette.darkVibrant?.slice(
        1,
      )}/fff/?text=${toInitials(name)}`;

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-lg p-0.5"
      style={{ backgroundColor: palette.darkVibrant }}
    >
      <img alt="cast" className="rounded-t-lg" src={profile} />

      <div className="flex-grow p-1.5">
        <div>{name}</div>
        {character && <div>{character}</div>}
        {jobs && (
          <div>
            {jobs.map((j) => (
              <div key={j}>{j}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
