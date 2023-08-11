import { GENRE_NAMES } from '../../constants';
import { Genre, Language } from '../../types';

const findLanguage = (languages: Language[], languageId: string) =>
  languages.find(lang => lang.id === languageId);

const findGenre = (genres: Genre[], genreId: number) =>
  genres.find(genre => genre.id === genreId);

const getGenreName = (genreName: string) => GENRE_NAMES[genreName] || genreName;

export interface IStats {
  genre_id: number;
  language_id: string;
  vote_average: number;
  vote_count: number;
}

export const toStats = (genres: Genre[], languages: Language[], media: IStats) => ({
  genre: getGenreName(findGenre(genres, media.genre_id)?.name || '?'),
  language: findLanguage(languages, media.language_id)?.name || '?',
  voteAverage: media.vote_average,
  voteCount: media.vote_count,
});
