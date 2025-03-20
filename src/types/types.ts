import type { Database } from './database.gen';

// Prefix with 'T' if we need to hydrate joined tables
export type TCredit = Database['public']['Tables']['credit']['Row'];
export type Genre = Database['public']['Tables']['genre']['Row'];
export type Language = Database['public']['Tables']['language']['Row'];
export type TPerson = Database['public']['Tables']['person']['Row'];
export type TMovie = Database['public']['Tables']['movie']['Row'];
export type TShow = Database['public']['Tables']['show']['Row'];
export type Season = Database['public']['Tables']['season']['Row'];
export type Provider = Database['public']['Tables']['provider']['Row'];

export interface Credit extends TCredit {
	movie?: Film;
	show?: TShow;
	person: TPerson;
}

export interface Film extends TMovie {
	credits: Credit[];
	providers: Provider[];
}

export interface Show extends TShow {
	credits: Credit[];
	providers: Provider[];
	seasons: Season[];
}

export interface Person extends TPerson {
	credits: Credit[];
}

export interface Video {
	id: string;
	iso_3166_1: string;
	iso_639_1: string;
	key: string;
	name: string;
	official: boolean;
	published_at: string;
	site: string;
	size: number;
	type: string;
}
