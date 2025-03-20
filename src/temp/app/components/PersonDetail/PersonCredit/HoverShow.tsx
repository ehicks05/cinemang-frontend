import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { useFetchShow } from '~/hooks/useFetchShows';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { usePalette } from '~/utils/palettes/usePalettes';
import { ShowCard } from '../../ShowCard';
import HoverLoading from './HoverLoading';
import { container } from './constants';

const HoverShow = ({ id }: { id: number }) => {
	const { data: show, error, isLoading } = useFetchShow(id);

	const path = getTmdbImage({ path: show?.poster_path });
	const { palette, loading: isPaletteLoading } = usePalette({ path });

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
			{show && palette && <ShowCard show={show} palette={palette} />}
		</div>
	);
};

export default HoverShow;
