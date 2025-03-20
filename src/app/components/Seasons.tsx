import { sortBy } from 'lodash-es';
import { FaHeart } from 'react-icons/fa';
import { OriginalImageLink } from '~/core-components';
import type { Season } from '~/types/types';
import { getTmdbImage } from '~/utils/getTmdbImage';
import Stat from './Stat';

const SeasonCard = ({ season }: { season: Season }) => (
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
);

export const Seasons = ({ seasons }: { seasons: Season[] }) => (
	<div className="flex flex-col gap-4">
		<div className="text-xl font-bold">
			{seasons.length} Season
			{seasons.length > 1 && 's'}
		</div>
		{sortBy(seasons, (o) => o.season_number).map((season) => (
			<SeasonCard key={season.id} season={season} />
		))}
	</div>
);
