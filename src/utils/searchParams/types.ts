import { fallback } from '@tanstack/zod-adapter';
import { z } from 'zod';

export const SearchFormSchema = z.object({
	ascending: fallback(z.boolean(), false).default(false),
	creditName: fallback(z.string(), '').default(''),
	genre: fallback(z.number(), 0).default(0),
	language: fallback(z.string(), '').default(''),
	maxRating: fallback(z.number(), 0).default(10),
	maxVotes: fallback(z.number(), 0).default(100_000),
	minRating: fallback(z.number(), 0).default(6),
	page: fallback(z.number(), 0).default(0),
	providers: fallback(z.number().array(), []).default([]),
});

export type SearchForm = z.infer<typeof SearchFormSchema>;

export const MovieSearchFormSchema = SearchFormSchema.extend({
	maxReleasedAt: fallback(z.string(), '').default(''),
	minReleasedAt: fallback(z.string(), '').default(''),
	minVotes: fallback(z.number(), 0).default(500),
	title: fallback(z.string(), '').default(''),
	sortColumn: fallback(
		z.enum(['vote_count', 'vote_average', 'released_at']),
		'released_at',
	).default('released_at'),
});

export type MovieSearchForm = z.infer<typeof MovieSearchFormSchema>;

export const TvSearchFormSchema = SearchFormSchema.extend({
	maxLastAirDate: fallback(z.string(), '').default(''),
	minLastAirDate: fallback(z.string(), '').default(''),
	minVotes: fallback(z.number(), 0).default(300),
	name: fallback(z.string(), '').default(''),
	sortColumn: fallback(
		z.enum(['vote_count', 'vote_average', 'last_air_date']),
		'last_air_date',
	).default('last_air_date'),
});

export type TvSearchForm = z.infer<typeof TvSearchFormSchema>;
