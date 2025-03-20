import { Link } from '@tanstack/react-router';
import { SCALED_IMAGE } from '~/constants/constants';
import { useSystemData } from '~/hooks/useSystemData';
import type { Show } from '~/types/types';
import { getTmdbImage } from '~/utils/getTmdbImage';
import type { Palette } from '~/utils/palettes/palette';
import { MediaProviders } from './MediaProviders';
import MediaStats from './MediaStats';
import { toStats } from './utils';

export const ShowCard = ({ show, palette }: { show: Show; palette: Palette }) => {
	const { genres, languages } = useSystemData();

	const fontSize = show.name.length > 24 ? 'text-base' : 'text-lg';
	const posterUrl = getTmdbImage({ path: show.poster_path });
	const firstYear = show.first_air_date.slice(0, 4);
	const lastYear = show.last_air_date.slice(0, 4);
	const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

	return (
		<Link to={'/tv/$showId'} params={{ showId: String(show.id) }}>
			<div
				className="flex h-full flex-col gap-4 p-4 sm:rounded-lg"
				style={palette?.bgStyles}
			>
				<div className="flex gap-4">
					<div className="flex-shrink-0">
						<img
							alt="poster"
							height={SCALED_IMAGE.h}
							src={posterUrl}
							width={SCALED_IMAGE.w}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<div>
							<span className={`${fontSize} font-bold`}>{show.name}</span>
							<span className="text-xs text-gray-300">
								<span className="font-semibold"> {years}</span>
							</span>
						</div>
						<div>Status: {show.status.replace(' Series', '')}</div>
						<div>
							{show.cast.split(', ').map((name) => (
								<div key={name}>{name}</div>
							))}
						</div>
						<div className="flex-grow" />
						{show.providers && <MediaProviders selectedIds={show.providers} />}
					</div>
				</div>
				<div className="flex h-full flex-col justify-start gap-4">
					<MediaStats
						bgColor={palette.darkVibrant}
						data={toStats(genres, languages, show)}
					/>
					<div className="line-clamp-3 text-justify text-sm">{show.overview}</div>
				</div>
			</div>
		</Link>
	);
};
