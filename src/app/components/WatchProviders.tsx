import { FC } from 'react';
import { WatchProvider as IWatchProvider } from '../../types';

const WatchProvider: FC<{ provider: IWatchProvider }> = ({
  provider: { name, logo_path },
}) => (
  <img
    className="h-10 w-10 rounded-lg"
    src={`https://image.tmdb.org/t/p/original${logo_path}`}
    title={name}
  />
);

interface Props {
  selectedIds: { id: number }[];
  watchProviders: IWatchProvider[];
}

const WatchProviders: FC<Props> = ({ watchProviders, selectedIds }) => {
  const providers = selectedIds
    .map((id) => watchProviders.find((wp) => wp.id === id.id))
    .filter((p): p is IWatchProvider => p !== null && p !== undefined)
    // .filter((p) => p.display_priority <= 16)
    .sort((p1, p2) => p1.display_priority - p2.display_priority);

  if (providers.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {providers.map((provider) => {
        return <WatchProvider key={provider.id} provider={provider} />;
      })}
    </div>
  );
};

export default WatchProviders;
