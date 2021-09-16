import React, { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { useClient } from "react-supabase";
import { addMinutes, intervalToDuration, parseISO } from "date-fns";
import { usePalette } from "react-palette";
import { truncate } from "lodash";
import SearchForm, {
  ISearchForm,
  DEFAULT_SEARCH_FORM,
} from "./components/SearchForm";
import WatchProviders from "./components/WatchProviders";
import { format } from "date-fns";
import chroma from "chroma-js";
import { useDebounce } from "react-use";
import { Paginator } from "./components";
import Stats from "./components/Stats";

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
}> = ({ form: formProp, languages, genres }) => {
  const client = useClient();

  const [form, setForm] = useState(formProp);
  const [films, setFilms] = useState<any[] | null>();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useDebounce(
    () => {
      setForm(formProp);
    },
    250,
    [formProp]
  );

  useEffect(() => {
    setLoading(true);

    const fetchFilms = async () => {
      try {
        const query = client
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
          .like("language_id", form.language || "*");
        // .neq("watch_providers", null)

        if (form.genre) {
          query.eq("genre_id", form.genre || "*");
        }

        if (form.netflix) {
          query.eq("netflix", true);
        }

        if (form.amazonPrimeVideo) {
          query.eq("amazon_prime_video", true);
        }

        query
          .order(form.sortColumn, { ascending: form.ascending })
          .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        const filmsResults = await query;

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
      <Paginator
        pageSize={PAGE_SIZE}
        page={page}
        setPage={setPage}
        count={count}
      />
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
    ? `https://image.tmdb.org/t/p/w92/${film.poster_path}`
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
          <img className="" src={posterPath} alt="poster" />
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
      <div className="flex flex-col gap-4">
        <Stats bgColor={palette.darkVibrant || ""} data={statData} />
        <div
          className="text-justify"
          onClick={() => setTruncateOverview(!truncateOverview)}
        >
          {truncate(film.overview, {
            length: truncateOverview ? 256 : 1024,
            separator: " ",
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
