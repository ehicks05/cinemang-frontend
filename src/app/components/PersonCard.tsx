import { Palette } from '../hooks/usePalette';
import React from 'react';
import { Link } from 'react-router-dom';
import { getTmdbImage } from '../../utils';

interface Props {
  character?: string;
  creditId: string;
  jobs?: string[];
  name: string;
  palette: Palette;
  personId: number;
  profilePath?: string;
}

const toInitials = (name: string) => {
  const parts = name.split(' ');
  return [parts.at(0), parts.at(-1)]
    .map((part) => (part || '').slice(0, 1))
    .join('');
};

const getDefaultProfile = (name: string, color: string) =>
  `https://via.placeholder.com/300x450/${color}/fff/?text=${toInitials(name)}`;

const PersonCard = ({
  character,
  // creditId,
  jobs,
  name,
  palette,
  personId,
  profilePath,
}: Props) => {
  const profile = getTmdbImage({
    defaultImage: getDefaultProfile(name, palette.darkVibrant.slice(1)),
    path: profilePath,
  });

  return (
    <Link
      className="flex w-full flex-col gap-2 rounded-lg p-0.5"
      style={{ backgroundColor: palette.darkVibrant }}
      to={`/people/${personId}`}
    >
      <img alt="cast" className="rounded-t-lg" src={profile} />

      <div className="flex-grow p-1.5">
        <div>{name}</div>
        {character && <div>as {character}</div>}
        {jobs && (
          <div>
            {jobs.map((j) => (
              <div key={j}>{j}</div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PersonCard;
