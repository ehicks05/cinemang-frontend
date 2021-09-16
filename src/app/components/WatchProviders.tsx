import { FC } from "react";
import { IconType } from "react-icons";
import { SiAmazon, SiAppletv, SiHulu, SiNetflix } from "react-icons/si";

interface Provider {
  id?: number;
  name?: string;
  Icon?: IconType;
  color?: string;
}

const PROVIDERS: Record<number, Provider> = {
  8: { Icon: SiNetflix, color: "text-netflix" },
  9: { Icon: SiAmazon, color: "text-amazon" },
  15: { Icon: SiHulu, color: "text-green-500" },
  337: { Icon: undefined },
  350: { Icon: SiAppletv },
};

interface WatchProviderProps {
  provider: Provider;
}

const WatchProvider: FC<WatchProviderProps> = ({
  provider: { Icon, name, color = "text-gray-400" },
}) => {
  return (
    <div className="flex p-1 text-gree rounded border border-solid border-gray-600">
      <div className="flex">
        {Icon && <Icon className={`${color} text-xl`} />}
        {!Icon && <span className={`${color} text-xs`}>{name}</span>}
      </div>
    </div>
  );
};

interface Props {
  watchProviders: { provider_id: number; provider_name: string }[];
}

const WatchProviders: FC<Props> = ({ watchProviders }) => {
  if (!watchProviders) return null;
  const providers = watchProviders
    .map((p) => ({ ...PROVIDERS[p.provider_id], name: p.provider_name }))
    .filter((p) => p);

  if (providers.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap mx-auto gap-2">
        {providers.map((provider) => {
          return <WatchProvider key={provider.id} provider={provider} />;
        })}
      </div>
    </div>
  );
};

export default WatchProviders;
