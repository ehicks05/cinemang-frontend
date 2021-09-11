import { TextDecoder } from 'util';

import axios from 'axios';
const { format, subDays } = require('date-fns');
const zlib = require('zlib');
import { Movie, PrismaClient } from '@prisma/client';
import _ from 'lodash';
import Promise from 'bluebird';
import { isFirstDayOfMonth } from 'date-fns';
import logger from './logger';

const prisma = new PrismaClient();

const BASE_URL = 'https://api.themoviedb.org/3';
const PARAMS = { api_key: process.env.TMDB_API_KEY };
const api = axios.create({ baseURL: BASE_URL, params: PARAMS });

const getDailyFileIds = async () => {
  const url = `https://files.tmdb.org/p/exports/movie_ids_${format(
    subDays(new Date(), 1),
    'MM_dd_yyyy',
  )}.json.gz`;

  try {
    const result = await axios.get(url, {
      responseType: 'arraybuffer',
      maxBodyLength: 100_000_000,
    });
    const unzipped = zlib.gunzipSync(result.data);
    const decoded = new TextDecoder().decode(unzipped);
    return decoded
      .split('\n')
      .filter((l) => l)
      .map((line) => {
        const json = JSON.parse(line);
        return json.id;
      });
  } catch (e) {
    logger.error(e);
  }
};

const getGenres = async () => {
  const result = await api.get(`/genre/movie/list`);
  return result.data.genres;
};

const updateGenres = async () => {
  const data = await getGenres();
  await prisma.genre.deleteMany();
  await prisma.genre.createMany({ data });
  logger.info(`loaded ${data.length} genres`);
};

interface TmdbLanguage {
  iso_639_1: string;
  english_name: string;
}

const getLanguages = async () => {
  const result = await api.get(`/configuration/languages`);
  return result.data.map((lang: TmdbLanguage) => ({
    id: lang.iso_639_1,
    name: lang.english_name,
  }));
};

const updateLanguages = async () => {
  const data = await getLanguages();
  await prisma.language.deleteMany();
  await prisma.language.createMany({ data });
  logger.info(`loaded ${data.length} languages`);
};

const getMovie = async (id: number) => {
  try {
    const result = await api.get(
      `/movie/${id}?append_to_response=releases,credits,watch/providers,images`,
    );
    return result.data;
  } catch (e) {
    // if (axios.isAxiosError(e)) logger.error(e.message, { id });
  }
  return undefined;
};

const parseMovie = async (id: number) => {
  const data = await getMovie(id);
  if (!data || !data.credits || !data.releases || !data.genres) {
    return undefined;
  }

  const director = data.credits.crew.filter(
    (c: { job: string }) => c.job === 'Director',
  )[0]?.name;
  const cast = data.credits.cast
    .slice(0, 3)
    .map((c: { name: string }) => c.name);
  const certification = data.releases.countries.find(
    (r: { iso_3166_1: string; certification: string }) =>
      r.iso_3166_1 === 'US' && r.certification,
  )?.certification;
  const genreObj = data.genres[0];
  const genre = String(genreObj?.id);

  // what is required?
  if (
    !data.release_date ||
    !director ||
    !cast ||
    !data.poster_path ||
    !data.runtime ||
    data.vote_count < 3 ||
    !genre
  ) {
    return undefined;
  }

  return {
    tmdbId: data.id,
    imdbId: data.imdb_id,
    title: data.title,
    releasedAt: new Date(data.release_date),
    languageId: data.original_language,
    director,
    cast: cast.join(', '),
    posterPath: data.poster_path,
    posterData: data.posterData,
    overview: data.overview,
    runtime: data.runtime,
    certification,
    voteCount: data.vote_count,
    voteAverage: data.vote_average,
    genre,
    updatedAt: new Date(),
  } as Movie;
};

const processChunk = async (chunk: number[]) => {
  const data = await Promise.map(chunk, parseMovie, { concurrency: 64 });
  const failed = data.filter((i) => !i);
  const movies = data.filter((i) => i);

  try {
    await prisma.movie.deleteMany({ where: { tmdbId: { in: chunk } } });
    await prisma.movie.createMany({ data: movies as Movie[] });
  } catch (e) {
    logger.error(e);
  }

  logger.info(
    `chunk done: loaded ${movies.length} movies (${failed.length} failed)`,
  );
};

const updateLanguageCounts = async () => {
  const languageCounts = await prisma.movie.groupBy({
    by: ['languageId'],
    _count: true,
  });

  await Promise.each(languageCounts, async (languageCount) => {
    const { languageId: id, _count: count } = languageCount;
    await prisma.language.update({ where: { id }, data: { count } });
  });
  logger.info(`updated language counts`);
};

const getChangeEndpointIds = async () => {
  const start_date = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  try {
    const result = await api.get(`/movie/changes`, { params: { start_date } });
    const ids: number[] = result.data.results.map((r: { id: number }) => r.id);
    return ids;
  } catch (e) {
    logger.error(e);
  }
};

const updateMovies = async () => {
  const isStartOfMonth = isFirstDayOfMonth(new Date());
  const movieIds = isStartOfMonth
    ? await getDailyFileIds()
    : await getChangeEndpointIds();

  logger.info(
    `${isStartOfMonth ? 'daily file' : 'changes endpoint'} returned ${
      movieIds?.length
    } movie ids`,
  );

  const chunks = _.chunk(movieIds, 10_000);
  await Promise.each(chunks, processChunk);
};

const updateDb = async () => {
  logger.info('starting daily refresh');
  await Promise.all([updateGenres(), updateLanguages(), updateMovies()]);

  await updateLanguageCounts();
  logger.info('finished daily refresh');
};

export default updateDb;
