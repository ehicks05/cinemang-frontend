import { isBefore, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { tmdb } from '../tmdb';
import { Video } from '../types';

const config = { params: { append_to_response: 'videos' } };

const fetchMovieVideos = async (id: number) => tmdb.get(`/movie/${id}`, config);
const fetchShowVideos = async (id: number) => tmdb.get(`/tv/${id}`, config);
const fetchSeasonVideos = async (id: number, season: number) =>
  tmdb.get(`/tv/${id}/season/${season}`, config);

type Props =
  | { movieId: number }
  | { showId: number }
  | { showId: number; season: number };

export const useFetchTrailers = (input: Props) =>
  useQuery<Video[]>(['films', input, 'trailers'], async () => {
    const result =
      'movieId' in input
        ? await fetchMovieVideos(input.movieId)
        : 'season' in input
        ? await fetchSeasonVideos(input.showId, input.season)
        : await fetchShowVideos(input.showId);

    const media: { videos: { results: Video[] } } = result.data;

    const videos: Video[] = media.videos.results;
    const trailers = videos
      .filter(v => v.official && v.type === 'Trailer')
      .sort((v1, v2) =>
        isBefore(parseISO(v1.published_at), parseISO(v2.published_at)) ? 1 : -1,
      );

    return trailers;
  });
