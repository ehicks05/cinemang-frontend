import { Palette } from '@/hooks/usePalette';
import { useAtom } from 'jotai';
import React from 'react';
import { Link } from 'react-router-dom';
import { systemDataAtom } from '../../atoms';
import { SCALED_IMAGE } from '../../constants';
import { Film as IFilm } from '../../types';
import { getTmdbImage } from '../../utils';
import MediaProviders from './MediaProviders';
import MediaStats from './MediaStats';
import { toStats } from './utils';

const Film = ({ film, palette }: { film: IFilm; palette: Palette }) => {
	const [{ genres, languages }] = useAtom(systemDataAtom);

	const fontSize = film.title.length > 24 ? 'text-base' : 'text-lg';
	const posterUrl = getTmdbImage({ path: film.poster_path });
	const year = film.released_at.slice(0, 4);
	const runtime = `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}m`;

	return (
		<Link to={`/films/${film.id}`}>
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

export default Film;
