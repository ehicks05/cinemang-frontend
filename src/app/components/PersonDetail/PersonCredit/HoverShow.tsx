import { useFetchShow } from '@/hooks/useFetchShows';
import { usePalette } from '@/hooks/usePalette';
import { useTimeout } from 'react-use';
import { getTmdbImage } from '../../../../utils';
import { ShowCard } from '../../ShowCard';
import HoverLoading from './HoverLoading';
import { container } from './constants';

const HoverShow = ({ id }: { id: number }) => {
	const { data: show, error, isLoading } = useFetchShow(id);
	const posterPath = getTmdbImage({ path: show?.poster_path });
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
			{show && palette && <ShowCard show={show} palette={palette} />}
		</div>
	);
};

export default HoverShow;
