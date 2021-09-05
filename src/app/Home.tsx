import { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { useClient } from "react-supabase";
import { FaHeart, FaLanguage, FaStar, FaTheaterMasks } from "react-icons/fa";
import { addMinutes, intervalToDuration } from "date-fns";
import { IconType } from "react-icons";
import { usePalette } from "react-palette";
import { truncate } from "lodash";
import SearchForm, { ISearchForm, DEFAULT_SEARCH_FORM } from "./SearchForm";

export interface Genre {
  id: number;
  name: string;
}

export interface Language {
  id: number;
  name: string;
  count: number;
}

const Home: FC = () => {
  const [form, setForm] = useState<ISearchForm>(DEFAULT_SEARCH_FORM);

  const client = useClient();

  const [languages, setLanguages] = useState<any[] | null>();
  const [genres, setGenres] = useState<any[] | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

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

    const fetchData = async () => {
      try {
        const [languagesResults, genresResults] = await Promise.all([
          fetchLanguages(),
          fetchGenres(),
        ]);
        setLanguages(languagesResults.data);
        setGenres(genresResults.data);
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

  return (
    <div className="flex flex-col gap-4">
      <SearchForm
        form={form}
        setForm={setForm}
        languages={languages}
        genres={genres}
      />
      <Films form={form} languages={languages} genres={genres} />
    </div>
  );
};

const Films: FC<{ form: ISearchForm; languages: Language[]; genres: Genre[] }> =
  ({ form, languages, genres }) => {
    const client = useClient();

    const [films, setFilms] = useState<any[] | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>();

    useEffect(() => {
      setLoading(true);

      const fetchFilms = async () => {
        try {
          const filmsResults = await client
            .from("film")
            .select("*, film_genre (film_id, genre_id)")
            .ilike("title", `${form.title || ""}*`)
            .gte("user_vote_count", form.minVotes || 0)
            .lte("user_vote_count", form.maxVotes || 100_000_000)
            .gte("user_vote_average", form.minRating || 0)
            .lte("user_vote_average", form.minRating || 10)
            .order(form.sortColumn, { ascending: form.ascending })
            .limit(50);
          setFilms(filmsResults.data);
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      };

      fetchFilms();
    }, [form, client]);

    if (error || loading) return <Loading error={error} loading={loading} />;
    if (!films || films.length === 0) return <div>No films</div>;

    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {films.map((film) => {
          return (
            <Film
              key={film.tmdb_id}
              film={film}
              genres={genres}
              languages={languages}
            />
          );
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

  const posterPath = film.poster_path
    ? `https://image.tmdb.org/t/p/w92/${film.poster_path}`
    : "/92x138.png";
  const year = film.year.slice(0, film.year.indexOf("-"));
  const runtime = intervalToDuration({
    start: new Date(),
    end: addMinutes(new Date(), Number(film.runtime)),
  });
  const voteCount = Intl.NumberFormat().format(film.user_vote_count);
  const genre = findGenre(film.film_genre?.[0]?.genre_id)?.name;

  const { data: palette, loading, error } = usePalette(posterPath);

  if (loading || error) return <Loading error={error} loading={loading} />;

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
            stat={genre}
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
