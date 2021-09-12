import { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { useClient } from "react-supabase";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaLanguage,
  FaStar,
  FaTheaterMasks,
} from "react-icons/fa";
import { addMinutes, intervalToDuration, parseISO } from "date-fns";
import { IconType } from "react-icons";
import { usePalette } from "react-palette";
import { truncate } from "lodash";
import SearchForm, { ISearchForm, DEFAULT_SEARCH_FORM } from "./SearchForm";
import { format } from "date-fns";
import usePagination from "headless-pagination-react";
import { PaginatorLink } from "headless-pagination";
import { MdMovie } from "react-icons/md";
import chroma from "chroma-js";

const PAGE_SIZE = 20;

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
      return (
        client
          .from("language")
          .select("*")
          // .gt("count", 0)
          .order("count", { ascending: false })
      );
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

const Films: FC<{
  form: ISearchForm;
  languages: Language[];
  genres: Genre[];
}> = ({ form, languages, genres }) => {
  const client = useClient();

  const [films, setFilms] = useState<any[] | null>();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

    const fetchFilms = async () => {
      try {
        const filmsResults = await client
          .from("movie")
          .select("*", { count: "exact" })
          .ilike("title", `${form.title || ""}*`)
          .gte("vote_count", form.minVotes || 0)
          .lte("vote_count", form.maxVotes || 100_000_000)
          .gte("vote_average", form.minRating || 0)
          .lte("vote_average", form.maxRating || 10)
          .gte("released_at", form.minReleasedAt || "1870-01-01")
          .lte(
            "released_at",
            form.maxReleasedAt || new Date().toLocaleDateString()
          )
          .like("language_id", form.language || "*")
          .like("genre", form.genre || "*")
          .order(form.sortColumn, { ascending: form.ascending })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        setCount(filmsResults.count || 0);
        setFilms(filmsResults.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [form, page, client]);

  if (error || loading) return <Loading error={error} loading={loading} />;
  if (!films || films.length === 0) return <div>No films</div>;

  return (
    <>
      <Paginator page={page} setPage={setPage} count={count} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
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
      </div>
    </>
  );
};

interface PaginatorProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}
const Paginator: FC<PaginatorProps> = ({ page, setPage, count }) => {
  const { links, hasNext, hasPrevious, from, to } = usePagination({
    totalItems: count,
    initialPage: page + 1,
    perPage: PAGE_SIZE,
    maxLinks: 7,
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg">
      <div>{`Showing ${from}-${Math.min(to, count)} of ${count} results`}</div>
      <div className="flex -space-x-px">
        <Link
          page={page}
          setPage={setPage}
          link={{ active: false, disabled: !hasPrevious, label: "" }}
          prev
        >
          <FaChevronLeft className="my-auto text-sm" />
        </Link>
        {links.map((link) => (
          <Link page={page} setPage={setPage} link={link}>
            {link.label}
          </Link>
        ))}
        <Link
          page={page}
          setPage={setPage}
          link={{ active: false, disabled: !hasNext, label: "" }}
          next
        >
          <FaChevronRight className="my-auto text-sm" />
        </Link>
      </div>
    </div>
  );
};

interface LinkProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  link: PaginatorLink;
  prev?: boolean;
  next?: boolean;
}
const Link: FC<LinkProps> = ({ page, setPage, link, prev, next, children }) => {
  const newPage = prev ? page - 1 : next ? page + 1 : Number(link.label) - 1;
  const onClick = link.disabled ? undefined : () => setPage(newPage);
  return (
    <div
      onClick={onClick}
      className={`flex px-2 sm:px-3 sm:py-1 border border-solid border-gray-500 ${
        link.disabled ? "opacity-60" : "cursor-pointer"
      } ${!link.disabled && !link.active ? "hover:bg-gray-700" : undefined} ${
        link.active ? "z-10 bg-green-700 border-green-500" : undefined
      } ${prev ? "rounded-l-md px-1" : undefined} ${
        next ? "rounded-r-md px-1" : undefined
      }`}
    >
      {children}
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
    return genres?.find((genre) => genre.id === Number(genreId));
  };

  const getGenreName = (genre: {name: string}) => {
    const CUSTOM_NAMES = {'Science Fiction': 'Sci-Fi'} as Record <string, string>
    return CUSTOM_NAMES[genre.name] || genre.name;
  }

  const posterPath = film.poster_path
    ? `https://image.tmdb.org/t/p/w92/${film.poster_path}`
    : "/92x138.png";
  const year = format(parseISO(film.released_at), "yyyy");
  const runtime = intervalToDuration({
    start: new Date(),
    end: addMinutes(new Date(), Number(film.runtime)),
  });
  const voteCount = Intl.NumberFormat().format(film.vote_count);
  const genre = getGenreName(findGenre(film.genre));

  const { data: palette, loading, error } = usePalette(posterPath);

  if (loading || error) return <Loading error={error} loading={loading} />;

  const blend = chroma.mix(palette.darkVibrant || "", "rgb(38,38,38)", 0.9);
  const cardStyle = { backgroundColor: blend.toString() };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg" style={cardStyle}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img className="" src={posterPath} alt="poster" />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-bold text-lg">{film.title}</span>{" "}
            <span className="text-xs">({year})</span>
          </div>
          <div className="text-xs">{`${runtime.hours}h ${runtime.minutes}m`}</div>
          <div className="flex items-center gap-1">
            <MdMovie className="inline" /> {film.director}
          </div>
          <div>{film.cast}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap mx-auto gap-2">
          <FilmStat
            Icon={FaHeart}
            color={"text-red-600"}
            bgColor={palette.darkVibrant}
            stat={film.vote_average}
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
            color={"text-blue-400"}
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
      className="flex flex-col gap-1 items-center px-2 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-700"
      style={{ backgroundColor: bgColor }}
    >
      <div>
        <Icon className={color} />
      </div>
      <div className="text-xs sm:text-sm">{stat}</div>
    </div>
  );
};

export default Home;
