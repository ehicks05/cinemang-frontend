import type { ReactNode } from 'react';
import { useWindowSize } from 'usehooks-ts';

const MediaLayout = ({ children }: { children: ReactNode }) => {
	const { width } = useWindowSize();
	const minColumnWidth = width < 400 ? width - 16 - 16 - 16 - 16 : 360;
	const style = {
		gridTemplateColumns: `repeat( auto-fill, minmax(${minColumnWidth}px, 1fr) )`,
	};
	return (
		<div className="grid sm:gap-4" style={style}>
			{children}
		</div>
	);
};

export default MediaLayout;
