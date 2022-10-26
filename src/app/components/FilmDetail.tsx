import React, { useState } from 'react';
import { Loading } from '../../core-components';
import { addMinutes, intervalToDuration, parseISO, format } from 'date-fns';
import { usePalette } from '@lauriys/react-palette';
import { groupBy, truncate } from 'lodash';
import chroma from 'chroma-js';
import Stats from './Stats';
import WatchProviders from './WatchProviders';
import { Film as IFilm, Genre, Language, WatchProvider } from '../../types';
import { useFetchSystemData } from '../hooks/useFetchSystemData';
import { useFetchFilm } from '../hooks/useFetchFilms';
import { useParams } from 'react-router-dom';
import { GENRE_NAMES, IMAGE_WIDTH, SCALED_IMAGE } from '../../constants';
import PersonCard from './PersonCard';
import Trailers from './Trailers';

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

  const grouped = groupBy(film.crew_credit, (c) => c.personId);

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
            <span className="text-lg font-bold">{film.title}</span>{' '}
            <span className="text-xs text-gray-300" title={releasedAt}>
              ({year})
            </span>
          </div>
          <div className="text-xs text-gray-300">{`${runtime.hours}h ${runtime.minutes}m`}</div>
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
      <div className="flex flex-col justify-between gap-4">
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
      <div>
        <h1 className="font-bold">trailers</h1>
        <Trailers movieId={film.id} palette={palette} />
      </div>
      <div>
        <h1 className="font-bold">more like this</h1>
      </div>
      <div>
        <h1 className="font-bold">cast and crew</h1>
        <h1 className="font-bold">cast</h1>
        <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:sm:grid-cols-5 xl:sm:grid-cols-6 2xl:grid-cols-7">
          {film.cast_credit
            .sort((c1, c2) => c1.order - c2.order)
            .map((c) => (
              <PersonCard
                character={c.character}
                creditId={c.credit_id}
                key={c.credit_id}
                name={c.person.name}
                palette={palette}
                profilePath={c.person.profile_path}
              />
            ))}
        </div>
        <h1 className="font-bold">crew</h1>
        <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:sm:grid-cols-5 xl:sm:grid-cols-6 2xl:grid-cols-7">
          {Object.values(grouped)
            .sort((c1, c2) => c2[0].person.popularity - c1[0].person.popularity)
            .map((c) => (
              <PersonCard
                creditId={c[0].credit_id}
                jobs={c.map((c) => c.job)}
                key={c[0].credit_id}
                name={c[0].person.name}
                palette={palette}
                profilePath={c[0].person.profile_path}
              />
            ))}
        </div>
      </div>
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
