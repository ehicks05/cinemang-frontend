import { useAtom } from 'jotai';
import { FC } from 'react';
import { WatchProvider as IWatchProvider } from '../../types';
import { systemDataAtom } from '../../atoms';
import { getTmdbImage } from '../../utils';

const WatchProvider: FC<{ provider: IWatchProvider }> = ({
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

const WatchProviders: FC<Props> = ({ selectedIds }) => {
  const [{ watchProviders }] = useAtom(systemDataAtom);
  const providers = selectedIds
    .map(id => watchProviders.find(wp => wp.id === id.id))
    .filter((p): p is IWatchProvider => p !== null && p !== undefined)
    // .filter((p) => p.display_priority <= 16)
    .sort((p1, p2) => p1.display_priority - p2.display_priority);

  if (providers.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {providers.map(provider => (
        <WatchProvider key={provider.id} provider={provider} />
      ))}
    </div>
  );
};

export default WatchProviders;
