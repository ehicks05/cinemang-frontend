import { PaletteColors } from '@lauriys/react-palette';
import React from 'react';
import { Video } from '../../types';
import { useFetchTrailers } from '../hooks/useFetchFilms';

const YoutubeEmbed = ({ embedId }: { embedId: string }) => {
  return (
    <div className="relative h-0 overflow-hidden pb-64">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // eslint-disable-next-line react/no-unknown-property
        allowFullScreen
        className="absolute left-0 top-0 h-full w-full"
        frameBorder="0"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        title="Embedded youtube"
        width="853"
      />
    </div>
  );
};

interface TrailerCardProps {
  palette: PaletteColors;
  trailer: Video;
}

const TrailerCard = ({ trailer: { name, key }, palette }: TrailerCardProps) => {
  return (
    <div
      className="flex w-full flex-col gap-2 rounded-lg p-1"
      style={{ backgroundColor: palette.darkVibrant }}
    >
      <YoutubeEmbed embedId={key} />

      <div className="flex-grow p-2">
        <div>{name}</div>
      </div>
    </div>
  );
};

interface Props {
  movieId: number;
  palette: PaletteColors;
}

const Trailers = ({ movieId, palette }: Props) => {
  const { data: trailers } = useFetchTrailers(movieId);
  if (!trailers || trailers.length === 0) return <div>no trailers</div>;
  return (
    <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:sm:grid-cols-3">
      {trailers.map((trailer) => (
        <TrailerCard key={trailer.id} palette={palette} trailer={trailer} />
      ))}
    </div>
  );
};

export default Trailers;
