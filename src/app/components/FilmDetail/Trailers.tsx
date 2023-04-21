import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Video } from '../../../types';
import { useFetchTrailers } from '../../hooks/useFetchFilms';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { Palette } from '../../hooks/usePalette';

interface TrailerCardProps {
  palette: Palette;
  trailer: Video;
}

const TrailerCard = ({ trailer: { name, key }, palette }: TrailerCardProps) => (
  <div
    className="flex w-full flex-col gap-2 rounded-lg p-1"
    style={{ backgroundColor: palette.darkVibrant }}
  >
    <LiteYouTubeEmbed id={key} title={name} />

    <div className="flex-grow p-2">
      <div>{name}</div>
    </div>
  </div>
);

interface Props {
  movieId: number;
  palette: Palette;
}

const Trailers = ({ movieId, palette }: Props) => {
  const { data: trailers } = useFetchTrailers(movieId);
  if (!trailers || trailers.length === 0) return <div>no trailers</div>;
  return (
    <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:sm:grid-cols-3">
      {trailers.map(trailer => (
        <TrailerCard key={trailer.id} palette={palette} trailer={trailer} />
      ))}
    </div>
  );
};

export default Trailers;
