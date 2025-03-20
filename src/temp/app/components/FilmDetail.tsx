import { addMinutes, format, intervalToDuration, parseISO } from 'date-fns';
import { useDocumentTitle } from 'usehooks-ts';
import { OriginalImageLink } from '~/core-components';
import Credits from '~/core-components/Credits';
import Trailer from '~/core-components/Trailer/Trailer';
import { useSystemData } from '~/hooks/useSystemData';
import type { Film, Video } from '~/types/types';
import { getTmdbImage } from '~/utils/getTmdbImage';
import type { Palette } from '~/utils/palettes/palette';
import { usePalette } from '~/utils/palettes/usePalettes';
import MediaProviders from './MediaProviders';
import FilmStats from './MediaStats';
import { toStats } from './utils';

const FilmDetail = ({
	film,
	palette,
	trailer,
}: { film: Film; palette: Palette; trailer: Video }) => {
	useDocumentTitle(film.title);
	const { genres, languages } = useSystemData();

	const posterUrl = getTmdbImage({ path: film.poster_path, width: 'w500' });
	const year = format(parseISO(film.released_at), 'yyyy');
	const runtime = intervalToDuration({
		end: addMinutes(new Date(), Number(film.runtime)),
		start: new Date(),
	});

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
					<span>{`${runtime.hours || 0}h ${runtime.minutes}m`}</span>
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
						{trailer && <Trailer trailer={trailer} />}
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

export const FilmDetailWrapper = ({
	film,
	trailer,
}: { film: Film; trailer: Video }) => {
	const { isLoading, palette } = usePalette({ path: film.poster_path });

	if (isLoading || !palette) return '';

	return <FilmDetail film={film} palette={palette} trailer={trailer} />;
};
