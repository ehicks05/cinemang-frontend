import React from 'react';
import { Loading } from '../../core-components';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import chroma from 'chroma-js';
import Stats from './Stats';
import WatchProviders from './WatchProviders';
import { Film as IFilm, Genre, Language, WatchProvider } from '../../types';
import { useFetchSystemData } from '../hooks/useFetchSystemData';
import { useFetchFilm } from '../hooks/useFetchFilms';
import { useParams } from 'react-router-dom';
import { GENRE_NAMES } from '../../constants';
import Trailers from './Trailers';
import Credits from './Credits';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const FilmDetail = ({
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
    ? `https://image.tmdb.org/t/p/original${film.poster_path}`
    : '/92x138.png';
  const releasedAt = format(parseISO(film.released_at), 'MM-dd-yyyy');
  const year = format(parseISO(film.released_at), 'yyyy');
  const runtime = intervalToDuration({
    end: addMinutes(new Date(), Number(film.runtime)),
    start: new Date(),
  });

  const { data: palette, loading, error } = usePalette(posterUrl);

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
    <div
      className="m-auto flex max-w-screen-lg flex-col gap-4 rounded-lg p-4"
      style={cardStyle}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-shrink-0">
          <img alt="poster" className="sm:h-96 sm:w-64" src={posterUrl} />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="text-lg font-bold">{film.title}</span>{' '}
            <span className="text-xs text-gray-300" title={releasedAt}>
              ({year})
            </span>
          </div>
          <div className="text-xs text-gray-300">{`${runtime.hours}h ${runtime.minutes}m`}</div>
          <div>{film.director}</div>
          <div>{film.cast}</div>
          <div className="max-w-prose text-justify text-sm">
            {film.overview}
          </div>
          <div className="mt-4 flex flex-col justify-between gap-4">
            <Stats bgColor={palette.darkVibrant || ''} data={statData} />
          </div>
          <div className="mt-4">Watch on:</div>
          {film.watch_provider && (
            <WatchProviders
              selectedIds={film.watch_provider}
              watchProviders={watchProviders}
            />
          )}
        </div>
      </div>

      <div>
        <h1 className="font-bold">trailers</h1>
        <Trailers movieId={film.id} palette={palette} />
      </div>
      <div>
        <h1 className="font-bold">more like this</h1>
        TODO
      </div>
      <Credits film={film} palette={palette} />
    </div>
  );
};

const FilmDetailWrapper = () => {
  const { id } = useParams();

  const systemDataQuery = useFetchSystemData();
  const filmQuery = useFetchFilm(Number(id) || 0);

  const error = systemDataQuery.error || filmQuery.error;
  const isLoading = systemDataQuery.isLoading || filmQuery.isLoading;
  const systemData = systemDataQuery.data;
  const filmData = filmQuery.data;

  if (error || isLoading) return <Loading error={error} loading={isLoading} />;
  if (!systemData) {
    return <Loading error={'systemData is undefined'} loading={isLoading} />;
  }
  const { genres, languages, watchProviders } = systemData;
  if (!genres?.length || !languages?.length || !watchProviders?.length)
    return <div>Missing system data</div>;

  if (!filmData) {
    return <Loading error={'films are not defined'} loading={isLoading} />;
  }
  const film = filmData;

  if (!film) return <div>Missing film</div>;

  return (
    <FilmDetail
      film={film}
      genres={genres}
      languages={languages}
      watchProviders={watchProviders}
    />
  );
};

export default FilmDetailWrapper;
