import { atom } from 'jotai';
import { Genre, Language, Provider } from './types';

export const systemDataAtom = atom<{
	genres: Genre[];
	languages: Language[];
	providers: Provider[];
}>({
	genres: [],
	languages: [],
	providers: [],
});
