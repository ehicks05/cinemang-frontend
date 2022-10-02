import { FC } from "react";

interface Provider {
  provider_id: number;
  provider_name: string;
  display_priority: number;
  logo_path: string;
}

const WatchProvider: FC<{ provider: Provider }> = ({
  provider: { provider_name, logo_path },
}) => (
  <img
    title={provider_name}
    className="w-10 h-10 rounded-lg"
    src={`https://image.tmdb.org/t/p/original${logo_path}`}
  />
);

interface Props {
  watchProviders: Provider[];
}

const WatchProviders: FC<Props> = ({ watchProviders }) => {
  const providers = watchProviders
    .filter((p) => p.display_priority <= 16)
    .sort((p1, p2) => p1.display_priority - p2.display_priority);

  if (providers.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {providers.map((provider) => {
        return <WatchProvider key={provider.provider_id} provider={provider} />;
      })}
    </div>
  );
};

export default WatchProviders;
