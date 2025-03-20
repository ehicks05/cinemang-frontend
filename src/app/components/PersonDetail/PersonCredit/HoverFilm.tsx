import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { useFetchFilm } from '~/hooks/useFetchFilms';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { usePalette } from '~/utils/palettes/usePalettes';
import { FilmCard } from '../../FilmCard';
import HoverLoading from './HoverLoading';
import { container } from './constants';

const HoverFilm = ({ id }: { id: number }) => {
	const { data: film, error, isLoading } = useFetchFilm(id);
	const path = getTmdbImage({ path: film?.poster_path });
	const { palette, isLoading: isPaletteLoading } = usePalette({ path });

	const [isReady, setIsReady] = useState(false);
	useTimeout(() => setIsReady(true), 1000);

	if (isReady && (error || isLoading || isPaletteLoading)) {
		return (
			<HoverLoading
				background={palette?.bgStyles.background || '#333'}
				error={error}
				isLoading={isLoading || isPaletteLoading}
			/>
		);
	}

	return (
		<div className={container}>
			{film && palette && <FilmCard film={film} palette={palette} />}
		</div>
	);
};

export default HoverFilm;
