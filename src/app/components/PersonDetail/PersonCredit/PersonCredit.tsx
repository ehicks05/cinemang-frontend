import * as HoverCard from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { pick } from 'lodash';
import React from 'react';
import { useWindowSize } from 'react-use';
import { Credit, Genre, Language } from '../../../../types';
import FilmStats from '../../MediaStats';
import { toStats } from '../../utils';
import HoverFilm from './HoverFilm';
import HoverShow from './HoverShow';

interface Props {
	bgColor: string;
	credit: Credit;
	genres: Genre[];
	languages: Language[];
}

const getYears = (credit: Credit) => {
	if (credit.movie) {
		return format(parseISO(credit.movie.released_at), 'yyyy');
	}
	if (credit.show) {
		const firstYear = format(parseISO(credit.show.first_air_date), 'yyyy');
		const lastYear = format(parseISO(credit.show.last_air_date), 'yyyy');
		return firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;
	}
};

const PersonCredit = ({ bgColor, genres, languages, credit }: Props) => {
	const { width } = useWindowSize();
	const year = getYears(credit);
	const media = credit.movie ? credit.movie! : credit.show!;
	const mediaName = 'title' in media ? media.title : media.name;

	const creditText = (
		<span>{credit.character || `${credit.department} - ${credit.job}`}</span>
	);

	return (
		<HoverCard.Root openDelay={100}>
			<div
				className="flex flex-col justify-between gap-2 rounded border p-2 sm:flex-row sm:items-center"
				key={credit.credit_id}
				style={{ borderColor: bgColor }}
			>
				<div className="flex flex-col items-baseline gap-2 sm:flex-row">
					<span className="hidden text-xs sm:inline">{year} </span>
					<div className="flex flex-col items-baseline gap-2 lg:flex-row">
						<span className="flex items-baseline gap-2">
							<HoverCard.Trigger asChild>
								<Link
									to={`${credit.movie ? '/films/$id' : '/shows/$id'}`}
									params={{ id: String(media.id) }}
								>
									<span className="font-bold sm:text-lg">{mediaName}</span>
									<span className="inline text-xs sm:hidden"> {year}</span>
								</Link>
							</HoverCard.Trigger>
						</span>{' '}
						{creditText}
					</div>
				</div>
				<div>
					<FilmStats
						autoWidth={width < 640}
						bgColor={bgColor}
						data={pick(toStats(genres, languages, media), [
							'voteAverage',
							'voteCount',
						])}
					/>
				</div>
			</div>
			<HoverCard.Portal>
				<HoverCard.Content>
					{credit.movie_id && <HoverFilm id={credit.movie_id} />}
					{credit.show_id && <HoverShow id={credit.show_id} />}

					<HoverCard.Arrow className="text-gray-700" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
};

export default PersonCredit;
