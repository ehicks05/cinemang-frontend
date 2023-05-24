import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Video } from '../../../types';
import { useFetchTrailers } from '@/hooks/useFetchFilms';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const nameIncludesOfficial = (t: Video) => t.name.includes('Official');

interface Props {
  movieId: number;
}

const Trailer = ({ movieId }: Props) => {
  const { data } = useFetchTrailers(movieId);
  if (!data || data.length === 0) return null;

  const trailers =
    data
      ?.sort((t1, t2) => t1.name.length - t2.name.length)
      .sort((t1, t2) => t1.name.localeCompare(t2.name)) || [];
  const officialTrailer =
    trailers.filter(nameIncludesOfficial)?.[0] || trailers?.[0] || [];

  return (
    <div className="">
      {officialTrailer && (
        <LiteYouTubeEmbed
          id={officialTrailer.key}
          title={officialTrailer.name}
          wrapperClass="yt-lite rounded-lg"
        />
      )}
    </div>
  );
};

export default Trailer;
