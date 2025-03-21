import { FaImage } from 'react-icons/fa';
import { SCALED_IMAGE } from '~/constants/constants';

const Image = () => (
	<div
		className="flex items-center justify-center rounded-sm bg-neutral-700"
		style={{ height: SCALED_IMAGE.h, width: SCALED_IMAGE.w }}
	>
		<FaImage className="h-16 w-16 text-neutral-400" />
	</div>
);

const Text = ({ h = 'h-4' }: { h?: string }) => (
	<div className={`${h} w-full rounded-lg bg-neutral-700`} />
);

export const Sk = { Image, Text };
