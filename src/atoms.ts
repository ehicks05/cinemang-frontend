import { atom } from 'jotai';
import { Genre, Language, WatchProvider } from './types';

export const systemDataAtom = atom<{
  genres: Genre[];
  languages: Language[];
  watchProviders: WatchProvider[];
}>({
  genres: [],
  languages: [],
  watchProviders: [],
});
