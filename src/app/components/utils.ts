import { GENRE_NAMES } from '../../constants';
import { Film, Genre, Language } from '../../types';

const findLanguage = (languages: Language[], languageId: string) =>
  languages.find(lang => lang.id === languageId);

const findGenre = (genres: Genre[], genreId: number) =>
  genres.find(genre => genre.id === genreId);

const getGenreName = (genreName: string) => GENRE_NAMES[genreName] || genreName;

export const toStats = (genres: Genre[], languages: Language[], film: Film) => ({
  genre: getGenreName(findGenre(genres, film.genre_id)?.name || '?'),
  language: findLanguage(languages, film.language_id)?.name || '?',
  voteAverage: film.vote_average,
  voteCount: film.vote_count,
});
