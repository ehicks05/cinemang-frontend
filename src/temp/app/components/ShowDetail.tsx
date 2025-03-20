import { format, parseISO } from 'date-fns';
import { useDocumentTitle } from 'usehooks-ts';
import { Credits, OriginalImageLink, Trailer } from '~/core-components';
import { useSystemData } from '~/hooks/useSystemData';
import type { Show, Video } from '~/types/types';
import { getTmdbImage } from '~/utils/getTmdbImage';
import type { Palette } from '~/utils/palettes/palette';
import { usePalette } from '~/utils/palettes/usePalettes';
import MediaProviders from './MediaProviders';
import FilmStats from './MediaStats';
import { Seasons } from './Seasons';
import { toStats } from './utils';

const ShowDetail = ({
	show,
	palette,
	trailer,
}: { show: Show; palette: Palette; trailer: Video }) => {
	useDocumentTitle(show.name);
	const { genres, languages } = useSystemData();

	const posterUrl = getTmdbImage({ path: show.poster_path, width: 'w500' });
	const firstYear = format(parseISO(show.first_air_date), 'yyyy');
	const lastYear = format(parseISO(show.last_air_date), 'yyyy');
	const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

	console.log(trailer);

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
						{trailer && <Trailer trailer={trailer} />}
						{show.providers.length > 0 && (
							<MediaProviders selectedIds={show.providers} />
						)}
						<div className="flex flex-col gap-2 rounded-lg bg-neutral-900 p-4">
							<div>Created By: {show.created_by}</div>
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

export const ShowDetailWrapper = ({
	show,
	trailer,
}: { show: Show; trailer: Video }) => {
	const { isLoading, palette } = usePalette({ path: show.poster_path });

	if (isLoading || !palette) return '';

	return <ShowDetail show={show} palette={palette} trailer={trailer} />;
};
