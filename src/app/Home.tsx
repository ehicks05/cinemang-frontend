import React, { FC, useEffect, useState } from "react";
import { Loading } from "components";
import { useClient } from "react-supabase";
import SearchForm, {
  ISearchForm,
  DEFAULT_SEARCH_FORM,
} from "./components/SearchForm";
import { useDebounce } from "react-use";
import { Paginator } from "./components";
import Film from "./components/Film";

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
      return client
        .from("language")
        .select("*")
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

        if (form.netflix && form.amazonPrimeVideo) {
          query.or(`netflix.eq.true,amazon_prime_video.eq.true`);
        } else {
          if (form.netflix) {
            query.eq("netflix", true);
          }

          if (form.amazonPrimeVideo) {
            query.eq("amazon_prime_video", true);
          }
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
