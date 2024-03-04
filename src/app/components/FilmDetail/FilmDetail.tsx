import { usePalette } from '@/hooks/usePalette';
import { addMinutes, format, intervalToDuration, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import React from 'react';
import { useTitle } from 'react-use';
import { systemDataAtom } from '../../../atoms';
import { Loading, OriginalImageLink } from '../../../core-components';
import Credits from '../../../core-components/Credits';
import Trailer from '../../../core-components/Trailer';
import { Film } from '../../../types';
import { getTmdbImage } from '../../../utils';
import MediaProviders from '../MediaProviders';
import FilmStats from '../MediaStats';
import { toStats } from '../utils';

export const FilmDetail = ({ film }: { film: Film }) => {
	useTitle(film.title, { restoreOnUnmount: true });
	const [{ genres, languages }] = useAtom(systemDataAtom);

	const posterUrl = getTmdbImage({ path: film.poster_path, width: 'w500' });
	const year = format(parseISO(film.released_at), 'yyyy');
	const runtime = intervalToDuration({
		end: addMinutes(new Date(), Number(film.runtime)),
		start: new Date(),
	});

	const { data: palette, isLoading, error } = usePalette(posterUrl);

	if (error) return <Loading error={error} loading={isLoading} />;
	if (isLoading || !palette) return <div className="h-full w-full bg-slate-700" />;

	return (
		<div
			className="m-auto flex max-w-screen-lg flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<div>
				<div className="text-2xl font-semibold sm:text-3xl">{film.title}</div>
				<div className="text-sm text-gray-300">
					<span title={film.released_at}>{year}</span>
					{' • '}
					<span>{`${runtime.hours}h ${runtime.minutes}m`}</span>
				</div>
			</div>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="flex-shrink-0">
					<div className="relative">
						<img
							alt="poster"
							className="w-full rounded-lg sm:w-80 md:w-96"
							src={posterUrl}
						/>
						<OriginalImageLink path={film.poster_path} />
					</div>
					<div className="mt-4 flex flex-col justify-between gap-4">
						<FilmStats
							bgColor={palette.darkVibrant}
							data={toStats(genres, languages, film)}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<Trailer movieId={film.id} />
						<div>Director: {film.director}</div>
						<div>Starring: {film.cast}</div>
						<div className="text-justify text-sm sm:text-base">{film.overview}</div>
					</div>

					{film.providers.length > 0 && (
						<MediaProviders selectedIds={film.providers} />
					)}
				</div>
			</div>
			<Credits credits={film.credits} palette={palette} />
		</div>
	);
};
