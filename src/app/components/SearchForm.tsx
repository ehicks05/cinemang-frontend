import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { useDebounceValue } from 'usehooks-ts';
import { Button, ComboBox } from '~/core-components';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '~/core-components/accordion';
import { useSystemData } from '~/hooks/useSystemData';
import { getTmdbImage } from '~/utils/getTmdbImage';
import {
	DEFAULT_MOVIE_SEARCH_FORM,
	DEFAULT_TV_SEARCH_FORM,
} from '~/utils/searchParams/constants';
import type { MovieSearchForm, TvSearchForm } from '~/utils/searchParams/types';

const SearchForm = () => (
	<Accordion type="single" collapsible>
		<AccordionItem
			value="foo"
			className="flex w-full flex-col gap-4 bg-neutral-800 p-4 border-none sm:rounded-lg"
		>
			<AccordionTrigger className="p-0 text-lg hover:no-underline">
				Search
			</AccordionTrigger>
			<AccordionContent className="p-0">
				<FormFields />
			</AccordionContent>
		</AccordionItem>
	</Accordion>
);

type SortColumn = 'vote_average' | 'vote_count' | 'released_at' | 'last_air_date';

const FormFields = () => {
	const { pathname } = useLocation();
	const mode = pathname === '/tv' ? 'tv' : 'movie';
	const from = mode === 'tv' ? '/tv/' : '/films/';
	const navigateFrom = mode === 'tv' ? '/tv' : '/films';

	const { genres, languages, providers } = useSystemData();

	const search = useSearch({ from });
	const navigate = useNavigate({ from: navigateFrom });

	const [form, setForm] = useState<MovieSearchForm | TvSearchForm>(search);
	const [debouncedForm, setDebouncedForm] = useDebounceValue(form, 500);

	const handleChange = (
		update: Partial<MovieSearchForm & TvSearchForm>,
		keepPage = false,
	) => {
		setForm({ ...form, ...update, page: keepPage ? form.page : 0 });
	};

	useEffect(() => {
		setDebouncedForm({ ...form });
	}, [form, setDebouncedForm]);

	useEffect(() => {
		navigate({ search: (prev) => ({ ...prev, ...debouncedForm }) });
	}, [navigate, debouncedForm]);

	return (
		<div className="grid gap-4 text-sm sm:grid-cols-2 sm:text-sm lg:grid-cols-3 xl:grid-cols-4">
			{mode === 'movie' && (
				<div className="flex gap-2">
					<div className="grow">
						<div>Title</div>
						<div>
							<input
								type="text"
								className="w-full bg-neutral-700"
								onChange={(e) => handleChange({ title: e.target.value })}
								value={'title' in form ? form.title : ''}
							/>
						</div>
					</div>
				</div>
			)}
			{mode === 'tv' && (
				<div className="flex gap-2">
					<div className="grow">
						<div>Title</div>
						<div>
							<input
								type="text"
								className="w-full bg-neutral-700"
								onChange={(e) => handleChange({ name: e.target.value })}
								value={'name' in form ? form.name : ''}
							/>
						</div>
					</div>
				</div>
			)}
			<div className="flex gap-2">
				<div className="grow">
					<div>Credits Include</div>
					<div>
						<input
							type="text"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ creditName: e.target.value })}
							value={form.creditName}
						/>
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<div className="w-full">
					<div>
						Stream{' '}
						{form.providers.length !== 0
							? `(${form.providers.length} selected)`
							: ''}
					</div>
					<div>
						<ComboBox
							options={providers
								// sort by selected providers, then by provider priority
								.sort((o1, o2) => o1.display_priority - o2.display_priority)
								.sort((o1, o2) => {
									const o1Selected = form.providers.includes(o1.id) ? 1 : -1;
									const o2Selected = form.providers.includes(o2.id) ? 1 : -1;
									return o2Selected - o1Selected;
								})
								.filter((p) => p.count > 0)
								.map((p) => ({
									id: p.id,
									label: p.name,
									imageUrl: getTmdbImage({ path: p.logo_path, width: 'original' }),
								}))}
							selectedOptions={form.providers}
							handleChange={(providers) => handleChange({ providers })}
						/>
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<div className="shrink-0">
					<div className="whitespace-nowrap">Min Votes</div>
					<div className="flex gap-2">
						<input
							type="number"
							className="w-full bg-neutral-700"
							max={form.maxVotes || undefined}
							min={1}
							onChange={(e) => handleChange({ minVotes: Number(e.target.value) })}
							value={form.minVotes}
						/>
					</div>
				</div>

				<div className="shrink">
					<div>Rating</div>
					<div className="flex gap-2">
						<input
							type="number"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ minRating: Number(e.target.value) })}
							value={form.minRating}
						/>
						<input
							type="number"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ maxRating: Number(e.target.value) })}
							value={form.maxRating}
						/>
					</div>
				</div>
			</div>
			{mode === 'movie' && (
				<div>
					<div>Released</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							type="date"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ minReleasedAt: e.target.value })}
							value={'minReleasedAt' in form ? form.minReleasedAt : 0}
						/>
						<input
							type="date"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ maxReleasedAt: e.target.value })}
							value={'maxReleasedAt' in form ? form.maxReleasedAt : 0}
						/>
					</div>
				</div>
			)}
			{mode === 'tv' && (
				<div>
					<div>Last Aired</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<input
							type="date"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ minLastAirDate: e.target.value })}
							value={'minLastAirDate' in form ? form.minLastAirDate : 0}
						/>
						<input
							type="date"
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ maxLastAirDate: e.target.value })}
							value={'maxLastAirDate' in form ? form.maxLastAirDate : 0}
						/>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="flex w-full flex-col">
					<div>Language</div>
					<div>
						<select
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ language: e.target.value })}
							value={form.language}
						>
							<option value="">Any</option>
							{languages
								.sort((o1, o2) => o2.count - o1.count)
								.slice(0, 10)
								.map((language) => (
									<option key={language.id} value={language.id}>
										{language.name}
									</option>
								))}
						</select>
					</div>
				</div>

				<div className="flex w-full flex-col">
					<div>Genre</div>
					<div>
						<select
							className="w-full bg-neutral-700"
							onChange={(e) => handleChange({ genre: Number(e.target.value) })}
							value={form.genre}
						>
							<option value="">Any</option>
							{genres
								.filter((o) => o.type !== (pathname === '/tv' ? 'MOVIE' : 'SHOW'))
								.map((genre) => (
									<option key={genre.id} value={genre.id}>
										{genre.name}
									</option>
								))}
						</select>
					</div>
				</div>
			</div>

			<div>
				<div>Sort</div>
				<div className="flex">
					<select
						className="w-full bg-neutral-700"
						onChange={(e) =>
							handleChange({ sortColumn: e.target.value as SortColumn }, true)
						}
						value={form.sortColumn}
					>
						{[
							{ label: 'User Rating', value: 'vote_average' } as const,
							{ label: 'User Votes', value: 'vote_count' },
							'minReleasedAt' in form
								? { label: 'Released', value: 'released_at' }
								: { label: 'Last Aired', value: 'last_air_date' },
						].map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<Button
						className="border-l-0 border-neutral-500 bg-neutral-700 px-3 text-white"
						onClick={() => handleChange({ ascending: !form.ascending }, true)}
					>
						{form.ascending ? (
							<HiSortAscending className="text-xl" />
						) : (
							<HiSortDescending className="text-xl" />
						)}
					</Button>
				</div>
			</div>

			<div>
				{/* Field title placeholder */}
				<div>&nbsp;</div>
				<div className="flex">
					<Button
						className="border-neutral-500 bg-neutral-700 px-3 py-2 text-base text-white"
						onClick={() =>
							handleChange({
								...(from === '/tv'
									? DEFAULT_TV_SEARCH_FORM
									: DEFAULT_MOVIE_SEARCH_FORM),
							})
						}
					>
						Reset
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SearchForm;
