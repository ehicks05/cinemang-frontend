import React, { useState } from 'react';
import { Loading } from '../../core-components';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import { truncate } from 'lodash';
import chroma from 'chroma-js';
import Stats from './Stats';
import WatchProviders from './WatchProviders';
import { Film as IFilm, Genre, Language, WatchProvider } from '../../types';
import { Link } from 'react-router-dom';
import { GENRE_NAMES, IMAGE_WIDTH, SCALED_IMAGE } from '../../constants';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const Film = ({
  film,
  genres,
  languages,
  watchProviders,
}: {
  film: IFilm;
  genres: Genre[];
  languages: Language[];
  watchProviders: WatchProvider[];
}) => {
  const findLanguage = (languageId: number) =>
    languages.find((lang) => lang.id === languageId);

  const findGenre = (genreId: number) =>
    genres.find((genre) => genre.id === genreId);

  const getGenreName = (genreName: string) =>
    GENRE_NAMES[genreName] || genreName;

  const posterUrl = film.poster_path
    ? `https://image.tmdb.org/t/p/w${IMAGE_WIDTH}${film.poster_path}`
    : '/92x138.png';
  const releasedAt = format(parseISO(film.released_at), 'MM-dd-yyyy');
  const year = format(parseISO(film.released_at), 'yyyy');
  const runtime = intervalToDuration({
    end: addMinutes(new Date(), Number(film.runtime)),
    start: new Date(),
  });

  const { data: palette, loading, error } = usePalette(posterUrl);
  const [truncateOverview, setTruncateOverview] = useState(true);

  if (error) return <Loading error={error} loading={loading} />;
  if (loading) return <div className="h-full w-full bg-slate-700" />;

  const lessMuted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.7);
  const muted = chroma.mix(palette.darkVibrant || '', 'rgb(38,38,38)', 0.95);
  const cardStyle = {
    background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
  };

  const statData = {
    genre: getGenreName(findGenre(film.genre_id)?.name || '?'),
    language: findLanguage(film.language_id)?.name || '?',
    voteAverage: nf.format(film.vote_average),
    voteCount:
      Number(film.vote_count) > 1000
        ? `${Math.round(film.vote_count / 1000)}k`
        : String(film.vote_count),
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4" style={cardStyle}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            alt="poster"
            height={SCALED_IMAGE.h}
            src={posterUrl}
            width={SCALED_IMAGE.w}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <Link className="text-lg font-bold" to={`/films/${film.id}`}>
              {film.title}
            </Link>
            <span className="text-xs text-gray-300" title={releasedAt}>
              {' '}
              {year}{' '}
              <span className="whitespace-nowrap">{`${runtime.hours}h ${runtime.minutes}m`}</span>
            </span>
          </div>
          <div>{film.director}</div>
          <div>{film.cast}</div>
          <div className="flex-grow"></div>
          {film.watch_provider && (
            <WatchProviders
              selectedIds={film.watch_provider}
              watchProviders={watchProviders}
            />
          )}
        </div>
      </div>
      <div className="flex h-full flex-col justify-between gap-4">
        <div
          className="text-justify text-sm"
          onClick={() => setTruncateOverview(!truncateOverview)}
        >
          {truncate(film.overview, {
            length: truncateOverview ? 256 : 1024,
            separator: ' ',
          })}
        </div>
        <Stats bgColor={palette.darkVibrant || ''} data={statData} />
      </div>
    </div>
  );
};

export default Film;
