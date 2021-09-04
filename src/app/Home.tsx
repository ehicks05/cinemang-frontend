import { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { useClient } from "react-supabase";
import { FaHeart, FaLanguage, FaStar, FaTheaterMasks } from "react-icons/fa";
import { addMinutes, intervalToDuration } from "date-fns";
import { IconType } from "react-icons";
import { usePalette } from "react-palette";
import { truncate } from "lodash";

const Home: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <SearchForm />
      <Films />
    </div>
  );
};

interface SearchForm {
  title?: string;
  minVotes?: number;
  maxVotes?: number;
  minReleased?: string;
  maxReleased?: string;
  minRating?: number;
  maxRating?: number;
  language?: string;
  genre?: string;

  sortColumn: string;
  sortDirection: number;
}

const DEFAULT_SEARCH_FORM = {
  language: "eng",
  sortColumn: "user_vote_count",
  sortDirection: -1,
};

const SearchForm = () => {
  const [searchForm, setSearchForm] = useState<SearchForm>(DEFAULT_SEARCH_FORM);
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="text-xl">Search</div>
      <div className="grid grid-cols-2 gap-2">
        <div>Title</div>
        <div>
          <input
            type="text"
            className="w-full bg-gray-700"
            value={searchForm.title}
            onChange={(e) =>
              setSearchForm({ ...searchForm, title: e.target.value })
            }
          />
        </div>
        <div>Votes</div>
        <div className="flex gap-2">
          <input
            type="number"
            className="w-full bg-gray-700"
            value={searchForm.minVotes}
            onChange={(e) =>
              setSearchForm({ ...searchForm, minVotes: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="w-full bg-gray-700"
            value={searchForm.maxVotes}
            onChange={(e) =>
              setSearchForm({ ...searchForm, maxVotes: Number(e.target.value) })
            }
          />
        </div>

        <div>Rating</div>
        <div className="flex gap-2">
          <input
            type="number"
            className="w-full bg-gray-700"
            value={searchForm.minRating}
            onChange={(e) =>
              setSearchForm({
                ...searchForm,
                minRating: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            className="w-full bg-gray-700"
            value={searchForm.maxRating}
            onChange={(e) =>
              setSearchForm({
                ...searchForm,
                maxRating: Number(e.target.value),
              })
            }
          />
        </div>

        <div>Released</div>
        <div className="flex gap-2">
          <input
            type="date"
            className="w-full bg-gray-700"
            value={searchForm.minReleased}
            onChange={(e) =>
              setSearchForm({
                ...searchForm,
                minReleased: e.target.value,
              })
            }
          />
          <input
            type="date"
            className="w-full bg-gray-700"
            value={searchForm.maxReleased}
            onChange={(e) =>
              setSearchForm({
                ...searchForm,
                maxReleased: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const Films = () => {
  const client = useClient();

  const [languages, setLanguages] = useState<any[] | null>();
  const [genres, setGenres] = useState<any[] | null>();
  const [films, setFilms] = useState<any[] | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const fetchLanguages = async () => {
      return client
        .from("language")
        .select("*")
        .gt("count", 0)
        .order("count", { ascending: false });
    };

    const fetchGenres = async () => {
      return client.from("genre").select("*");
    };

    const fetchFilms = async () => {
      return client
        .from("film")
        .select("*, film_genre (film_id, genre_id)")
        .order("user_vote_count", { ascending: false })
        .limit(50);
    };

    const fetchData = async () => {
      try {
        const [languagesResults, genresResults, filmsResults] =
          await Promise.all([fetchLanguages(), fetchGenres(), fetchFilms()]);
        setLanguages(languagesResults.data);
        setGenres(genresResults.data);
        setFilms(filmsResults.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client]);

  if (error || loading) return <Loading error={error} loading={loading} />;
  if (!genres || genres.length === 0) return <div>No genres</div>;
  if (!languages || languages.length === 0) return <div>No languages</div>;
  if (!films || films.length === 0) return <div>No films</div>;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {films.map((film) => {
        return <Film film={film} genres={genres} languages={languages} />;
      })}
      {/* <pre>{JSON.stringify(films, null, 2)}</pre> */}
    </div>
  );
};

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

  const posterPath = `https://image.tmdb.org/t/p/w92/${film.poster_path}`;
  const year = film.year.slice(0, film.year.indexOf("-"));
  const runtime = intervalToDuration({
    start: new Date(),
    end: addMinutes(new Date(), Number(film.runtime)),
  });
  const voteCount = Intl.NumberFormat().format(film.user_vote_count);

  const {
    data: palette,
    loading: loadingPalette,
    error: loadingPaletteError,
  } = usePalette(posterPath);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img className="" src={posterPath} alt="poster" />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-bold text-lg">{film.title}</span>{" "}
            <span className="text-sm">({year})</span>
          </div>
          <div>{`${runtime.hours}h ${runtime.minutes}m`}</div>
          <div>Director: {film.director} </div>
          <div>Cast: {film.actors}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <FilmStat
            Icon={FaHeart}
            color={"text-red-600"}
            bgColor={palette.darkVibrant}
            stat={film.user_vote_average}
          />
          <FilmStat
            Icon={FaStar}
            color={"text-yellow-300"}
            bgColor={palette.darkVibrant}
            stat={voteCount}
          />
          <FilmStat
            Icon={FaLanguage}
            color={"text-green-500"}
            bgColor={palette.darkVibrant}
            stat={findLanguage(film.language_id).name}
          />
          <FilmStat
            Icon={FaTheaterMasks}
            color={"text-blue-500"}
            bgColor={palette.darkVibrant}
            stat={findGenre(film.film_genre?.[0].genre_id).name}
          />
        </div>
        <div className="text-justify">
          {truncate(film.overview, {
            length: 256,
            separator: " ",
          })}
        </div>
      </div>
    </div>
  );
};

interface StatProps {
  Icon: IconType;
  color?: string;
  bgColor?: string;
  stat: string;
}

const FilmStat: FC<StatProps> = ({ Icon, color, bgColor, stat }) => {
  return (
    <div
      className="flex flex-col gap-1 items-center px-4 py-2 rounded-lg bg-gray-700"
      style={{ backgroundColor: bgColor }}
    >
      <div>
        <Icon className={color} />
      </div>
      <div className="text-sm">{stat}</div>
    </div>
  );
};

export default Home;
