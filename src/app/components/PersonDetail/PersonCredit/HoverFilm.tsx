import { useFetchFilm } from '@/hooks/useFetchFilms';
import { usePalette } from '@/hooks/usePalette';
import { useTimeout } from 'react-use';
import { getTmdbImage } from '../../../../utils';
import { FilmCard } from '../..';
import HoverLoading from './HoverLoading';
import { container } from './constants';

const HoverFilm = ({ id }: { id: number }) => {
	const { data: film, error, isLoading } = useFetchFilm(id);
	const posterPath = getTmdbImage({ path: film?.poster_path });
	const {
		data: palette,
		error: paletteError,
		isLoading: isPaletteLoading,
	} = usePalette(posterPath);
	const [isReady] = useTimeout(1000);

	if (isReady() && (error || paletteError || isLoading || isPaletteLoading)) {
		return (
			<HoverLoading
				background={palette?.bgStyles.background || '#333'}
				error={error || paletteError}
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
