import { Palette } from '@/hooks/usePalette';
import { systemDataQueryOptions } from '@/routes/__root';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { SCALED_IMAGE } from '../../constants';
import { Film as IFilm } from '../../types';
import { getTmdbImage } from '../../utils';
import MediaProviders from './MediaProviders';
import MediaStats from './MediaStats';
import { toStats } from './utils';

export const FilmCard = ({ film, palette }: { film: IFilm; palette: Palette }) => {
	const {
		data: { genres, languages },
	} = useSuspenseQuery(systemDataQueryOptions);

	const fontSize = film.title.length > 24 ? 'text-base' : 'text-lg';
	const posterUrl = getTmdbImage({ path: film.poster_path });
	const year = film.released_at.slice(0, 4);
	const runtime = `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}m`;

	return (
		<Link to="/films/$id" params={{ id: String(film.id) }}>
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
							<span className={`${fontSize} font-bold`}>{film.title}</span>
							<span className="text-xs text-gray-300" title={film.released_at}>
								<span className="font-semibold"> {year} </span>
								<span className="whitespace-nowrap">{runtime}</span>
							</span>
						</div>
						<div>{film.director}</div>
						<div>
							{film.cast.split(', ').map((name) => (
								<div key={name}>{name}</div>
							))}
						</div>
						<div className="flex-grow" />
						{film.providers && <MediaProviders selectedIds={film.providers} />}
					</div>
				</div>
				<div className="flex h-full flex-col justify-start gap-4">
					<MediaStats
						bgColor={palette.darkVibrant}
						data={toStats(genres, languages, film)}
					/>
					<div className="line-clamp-3 text-justify text-sm">{film.overview}</div>
				</div>
			</div>
		</Link>
	);
};
