import { Provider } from '@/types';
import { useAtom } from 'jotai';
import { FC } from 'react';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';

const MediaProvider: FC<{ provider: Provider }> = ({
	provider: { name, logo_path },
}) => (
	<img
		className="h-10 w-10 rounded-lg"
		src={getTmdbImage({ path: logo_path, width: 'original' })}
		title={name}
		alt={name}
	/>
);

interface Props {
	selectedIds: { id: number }[];
}

const MediaProviders: FC<Props> = ({ selectedIds }) => {
	const [{ providers }] = useAtom(systemDataAtom);

	const filteredProviders = selectedIds
		.map((id) => providers.find((p) => p.id === id.id))
		.filter((p): p is Provider => p !== null && p !== undefined)
		.filter((p) => p.display_priority <= 22)
		.sort((p1, p2) => p1.display_priority - p2.display_priority);

	if (filteredProviders.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-0.5">
			{filteredProviders.map((provider) => (
				<MediaProvider key={provider.id} provider={provider} />
			))}
		</div>
	);
};

export default MediaProviders;
