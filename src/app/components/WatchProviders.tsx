import { FC } from "react";
import { IconType } from "react-icons";
import { SiAmazon, SiAppletv, SiHulu, SiNetflix } from "react-icons/si";

interface Provider {
  id?: number;
  provider_name?: string;
  Icon?: IconType;
  color?: string;
}

const PROVIDER_RENDER_DETAILS: Record<number, Provider> = {
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
  provider: { Icon, provider_name, color = "text-gray-400" },
}) => {
  return (
    <div className="flex p-1 text-gree rounded border border-solid border-gray-600">
      <div className="flex">
        {Icon && <Icon className={`${color} text-xl`} />}
        {!Icon && <span className={`${color} text-xs`}>{provider_name}</span>}
      </div>
    </div>
  );
};

interface Props {
  watchProviders: {
    provider_id: number;
    provider_name: string;
    display_priority: number;
  }[];
}

const WatchProviders: FC<Props> = ({ watchProviders }) => {
  if (!watchProviders) return null;
  const providers = watchProviders
    .map((p) => ({ ...p, ...PROVIDER_RENDER_DETAILS[p.provider_id] }))
    .filter((p) => p.display_priority <= 6);

  if (providers.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap items-center mx-auto gap-2">
        {providers.map((provider) => {
          return <WatchProvider key={provider.id} provider={provider} />;
        })}
      </div>
    </div>
  );
};

export default WatchProviders;
