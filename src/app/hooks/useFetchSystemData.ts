import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const fetchGenres = async () => {
  const result = await supabase.from("genre").select("*");
  return result.data;
};

const fetchLanguages = async () => {
  const result = await supabase
    .from("language")
    .select("*")
    .order("count", { ascending: false });
  return result.data;
};

const fetchWatchProviders = async () => {
  const result = await supabase
    .from("watch_provider")
    .select("*")
    .order("display_priority");
  return result.data;
};

const fetchData = async () => {
  const [genres, languages, watchProviders] = await Promise.all([
    fetchGenres(),
    fetchLanguages(),
    fetchWatchProviders(),
  ]);

  return { genres, languages, watchProviders };
};

export const useFetchSystemData = () => {
  const [data, setData] = useState<{
    genres: any[] | null;
    languages: any[] | null;
    watchProviders: any[] | null;
  }>({
    genres: [],
    languages: [],
    watchProviders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setLoading(true);

    const doIt = async () => {
      try {
        const data = await fetchData();
        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    doIt();
  }, []);

  return { data, error, loading };
};
