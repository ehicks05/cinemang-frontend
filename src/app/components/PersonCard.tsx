import { PaletteColors } from '@lauriys/react-palette';
import React from 'react';
import { IMAGE_WIDTH } from '../../constants';

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
  // console.log({ creditId });
  const profile = profilePath
    ? `https://images.tmdb.org/t/p/w${IMAGE_WIDTH}${profilePath}`
    : `https://via.placeholder.com/300x450/${palette.darkVibrant?.slice(
        1,
      )}/fff/?text=${toInitials(name)}`;

  return (
    <div
      className="flex w-full flex-col gap-2 rounded-lg p-1"
      style={{ backgroundColor: palette.darkVibrant }}
    >
      <img alt="cast" className="rounded-t-lg" src={profile} />

      <div className="flex-grow p-2">
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
      {/* <pre>{JSON.stringify(c, null, 2)}</pre> */}
    </div>
  );
};

export default PersonCard;
