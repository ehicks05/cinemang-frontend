import { useFetchShow } from '@/hooks/useFetchShows';
import { usePalette } from '@/hooks/usePalette';
import { Disclosure } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { sortBy } from 'lodash';
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useTitle } from 'react-use';
import { systemDataAtom } from '../../../atoms';
import { Loading, OriginalImageLink } from '../../../core-components';
import Credits from '../../../core-components/Credits';
import Trailer from '../../../core-components/Trailer';
import { Season, Show } from '../../../types';
import { getTmdbImage } from '../../../utils';
import MediaProviders from '../MediaProviders';
import FilmStats from '../MediaStats';
import Stat from '../Stat';
import { toStats } from '../utils';

const ShowDetail = ({ show }: { show: Show }) => {
	useTitle(show.name, { restoreOnUnmount: true });
	const [{ genres, languages }] = useAtom(systemDataAtom);

	const posterUrl = getTmdbImage({ path: show.poster_path, width: 'w500' });
	const firstYear = format(parseISO(show.first_air_date), 'yyyy');
	const lastYear = format(parseISO(show.last_air_date), 'yyyy');
	const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

	const { data: palette, isLoading, error } = usePalette(posterUrl);

	if (error) return <Loading error={error} loading={isLoading} />;
	if (isLoading || !palette) return <div className="h-full w-full bg-slate-700" />;

	return (
		<div
			className="m-auto flex max-w-screen-lg flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<div>
				<div className="text-2xl font-semibold sm:text-3xl">{show.name}</div>
				<div className="text-sm text-gray-300">
					<span>
						{years} ({show.status})
					</span>
				</div>
			</div>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="w-full sm:w-2/5">
					<div className="relative w-full">
						<img alt="poster" className="w-full rounded-lg" src={posterUrl} />
						<OriginalImageLink path={show.poster_path} />
					</div>
					<div className="mt-4 flex flex-col justify-between gap-4">
						<FilmStats
							bgColor={palette.darkVibrant}
							data={toStats(genres, languages, show)}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col gap-4 sm:w-3/5">
					<div className="flex flex-grow flex-col gap-4">
						<Trailer showId={show.id} />
						{show.providers.length > 0 && (
							<MediaProviders selectedIds={show.providers} />
						)}
						<div className="flex flex-col gap-2 rounded-lg bg-neutral-900 p-4">
							<div>Starring: {show.cast}</div>
							<div className="text-justify text-sm sm:text-base">
								<div className="overflow-x-auto sm:max-h-24 md:max-h-32 lg:max-h-48">
									{show.overview}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Seasons seasons={show.seasons} />

			<Credits credits={show.credits} palette={palette} />
		</div>
	);
};

const SeasonCard = ({ season }: { season: Season }) => (
	<Disclosure>
		{({ open }) => (
			<div className="flex w-full flex-col gap-2 rounded-lg bg-neutral-900 p-4">
				<div className="flex w-full flex-col gap-2 rounded-lg bg-neutral-900 sm:flex-row">
					<div className="relative w-full flex-shrink-0 sm:w-40">
						<img
							alt="poster"
							className="w-full rounded-lg"
							src={getTmdbImage({
								path: season.poster_path || undefined,
								width: 'w500',
							})}
						/>
						<OriginalImageLink path={season.poster_path || undefined} />
					</div>

					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span className="font-semibold">{season.name}</span>
							<span className="text-sm opacity-75">{season.air_date}</span>
						</div>
						<div>{season.overview}</div>
						<span className="mt-2 flex w-full items-center gap-2">
							<Stat
								icon={FaHeart}
								label={season.vote_average || '?.?'}
								bgColor="#333"
								color="text-red-600"
								width="w-full sm:w-auto"
							/>
							<Stat
								label={`${season.episode_count} Episodes`}
								bgColor="#333"
								color="text-red-600"
								width="w-full sm:w-auto"
							/>
						</span>
					</div>
				</div>
			</div>
		)}
	</Disclosure>
);

const Seasons = ({ seasons }: { seasons: Season[] }) => (
	<div className="flex flex-col gap-4">
		<div className="text-xl font-bold">
			{seasons.filter((o) => o.season_number > 0).length} Seasons
		</div>
		{sortBy(seasons, (o) => o.season_number).map((season) => (
			<SeasonCard key={season.id} season={season} />
		))}
	</div>
);

const Wrapper = () => {
	const { id } = useParams();

	const { data: show, error, isLoading } = useFetchShow(Number(id) || 0);

	if (error || isLoading) return <Loading error={error} loading={isLoading} />;
	if (!show) {
		return <Loading error="shows are not defined" loading={isLoading} />;
	}

	return <ShowDetail show={show} />;
};

export default Wrapper;
