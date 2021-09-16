import React, { useState } from "react";
import { Loading } from "components";
import { addMinutes, intervalToDuration, parseISO } from "date-fns";
import { usePalette } from "react-palette";
import { truncate } from "lodash";
import { format } from "date-fns";
import chroma from "chroma-js";
import Stats from "./Stats";
import WatchProviders from "./WatchProviders";

const Film = ({
  film,
  genres,
  languages,
}: {
  film: any;
  genres: any[];
  languages: any[];
}) => {
  const findLanguage = (languageId: string) => {
    return languages?.find((lang) => lang.id === languageId);
  };

  const findGenre = (genreId: string) => {
    return genres?.find((genre) => genre.id === genreId);
  };

  const getGenreName = (genre: { name: string }) => {
    const CUSTOM_NAMES = { "Science Fiction": "Sci-Fi" } as Record<
      string,
      string
    >;
    return CUSTOM_NAMES[genre.name] || genre.name;
  };

  const posterPath = film.poster_path
    ? `https://image.tmdb.org/t/p/w154/${film.poster_path}`
    : "/92x138.png";
  const releasedAt = format(parseISO(film.released_at), "MM-dd-yyyy");
  const year = format(parseISO(film.released_at), "yyyy");
  const runtime = intervalToDuration({
    start: new Date(),
    end: addMinutes(new Date(), Number(film.runtime)),
  });

  const { data: palette, loading, error } = usePalette(posterPath);
  const [truncateOverview, setTruncateOverview] = useState(true);

  if (loading || error) return <Loading error={error} loading={loading} />;

  const lessMuted = chroma.mix(palette.darkVibrant || "", "rgb(38,38,38)", 0.7);
  const muted = chroma.mix(palette.darkVibrant || "", "rgb(38,38,38)", 0.95);
  const cardStyle = {
    background: `linear-gradient(45deg, ${muted} 5%, ${muted} 45%, ${lessMuted} 95%)`,
  };

  const statData = {
    voteAverage: film.vote_average,
    voteCount:
      Number(film.vote_count) > 1000
        ? `${Math.round(film.vote_count / 1000)}k`
        : film.vote_count,
    language: findLanguage(film.language_id).name,
    genre: getGenreName(findGenre(film.genre_id)),
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg" style={cardStyle}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img src={posterPath} alt="poster" />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-bold text-lg">{film.title}</span>{" "}
            <span className="text-xs text-gray-300" title={releasedAt}>
              ({year})
            </span>
          </div>
          <div className="text-xs text-gray-300">{`${runtime.hours}h ${runtime.minutes}m`}</div>
          <div>{film.director}</div>
          <div>{film.cast}</div>
          <WatchProviders watchProviders={film.watch_providers} />
        </div>
      </div>
      <div className="flex flex-col justify-between h-full gap-4">
        <div
          className="text-justify text-sm"
          onClick={() => setTruncateOverview(!truncateOverview)}
        >
          {truncate(film.overview, {
            length: truncateOverview ? 256 : 1024,
            separator: " ",
          })}
        </div>
        <Stats bgColor={palette.darkVibrant || ""} data={statData} />
      </div>
    </div>
  );
};

export default Film;
