import React, { FC, useEffect, useState } from "react";
import { Loading } from "core-components";
import { useClient } from "react-supabase";
import { useDebounce } from "react-use";
import { PAGE_SIZE } from "../constants";
import { Language, Genre, WatchProvider } from "../types";
import { Film, Paginator, SearchForm } from "./components";
import { useQueryParams } from "use-query-params";

const Home: FC = () => {
  const client = useClient();

  const [languages, setLanguages] = useState<Language[] | null>();
  const [genres, setGenres] = useState<Genre[] | null>();
  const [watchProviders, setWatchProviders] = useState<
    WatchProvider[] | null
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

    const fetchLanguages = async () => {
      return client
        .from("language")
        .select("*")
        .order("count", { ascending: false });
    };

    const fetchGenres = async () => {
      return client.from("genre").select("*");
    };

    const fetchWatchProviders = async () => {
      return client
        .from("watch_provider")
        .select("*")
        .order("display_priority");
    };

    const fetchData = async () => {
      try {
        const [languagesResults, genresResults, watchProviderResults] =
          await Promise.all([
            fetchLanguages(),
            fetchGenres(),
            fetchWatchProviders(),
          ]);
        setLanguages(languagesResults.data);
        setGenres(genresResults.data);
        setWatchProviders(watchProviderResults.data);
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
  if (!watchProviders || watchProviders.length === 0)
    return <div>No watch providers</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <SearchForm
          languages={languages}
          genres={genres}
          watchProviders={watchProviders}
        />
      </div>
      <Films
        languages={languages}
        genres={genres}
        watchProviders={watchProviders}
      />
    </div>
  );
};

const Films: FC<{
  languages: Language[];
  genres: Genre[];
  watchProviders: WatchProvider[];
}> = ({ languages, genres, watchProviders }) => {
  const client = useClient();

  const [formProp] = useQueryParams();

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
          .select("*, watch_provider!inner(provider_id)", { count: "exact" })
          .ilike("title", `%${form.title || ""}%`)
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

        if (form.genre) {
          query.eq("genre_id", form.genre || "*");
        }

        if (form.watchProviders.length > 0) {
          query.in("watch_provider.provider_id", form.watchProviders);
        }

        query
          .order(form.sortColumn, { ascending: form.ascending })
          .order("tmdb_id", { ascending: true })
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
              watchProviders={watchProviders}
            />
          );
        })}
      </div>
      <Paginator
        pageSize={PAGE_SIZE}
        page={page}
        setPage={setPage}
        count={count}
      />
    </>
  );
};

export default Home;
