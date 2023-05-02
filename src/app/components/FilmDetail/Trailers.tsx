import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Video } from '../../../types';
import { useFetchTrailers } from '@/hooks/useFetchFilms';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { Palette } from '@/hooks/usePalette';

interface TrailerCardProps {
  palette: Palette;
  trailer: Video;
}

const TrailerCard = ({ trailer: { name, key }, palette }: TrailerCardProps) => (
  <div
    className="flex w-full flex-col gap-2 rounded-lg p-0.5"
    style={{ backgroundColor: palette.darkVibrant }}
  >
    <LiteYouTubeEmbed id={key} title={name} wrapperClass="yt-lite rounded-lg" />

    <div className="flex-grow p-2">
      <div>{name}</div>
    </div>
  </div>
);

const nameIncludesOfficial = (t: Video) => t.name.includes('Official');

interface Props {
  movieId: number;
  palette: Palette;
}

const Trailers = ({ movieId, palette }: Props) => {
  const { data } = useFetchTrailers(movieId);
  if (!data || data.length === 0) return null;

  const trailers =
    data
      ?.sort((t1, t2) => t1.name.length - t2.name.length)
      .sort((t1, t2) => t1.name.localeCompare(t2.name)) || [];
  const officialTrailer =
    trailers.filter(nameIncludesOfficial)?.[0] || trailers?.[0] || [];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Trailer</h1>
      <div className="grid grid-cols-1 justify-center gap-4 lg:grid-cols-2 xl:sm:grid-cols-3">
        {officialTrailer && (
          <TrailerCard
            key={officialTrailer.id}
            palette={palette}
            trailer={officialTrailer}
          />
        )}
      </div>
    </div>
  );
};

export default Trailers;
