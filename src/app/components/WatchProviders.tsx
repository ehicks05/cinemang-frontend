import { FC } from "react";
import { IconType } from "react-icons";
import { SiAmazon, SiAppletv, SiHulu, SiNetflix } from "react-icons/si";

interface Provider {
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface ProviderUI {
  Icon?: IconType;
  color?: string;
}

const PROVIDER_RENDER_DETAILS: Record<number, ProviderUI> = {
  8: { Icon: SiNetflix, color: "text-netflix" },
  9: { Icon: SiAmazon, color: "text-amazon" },
  15: { Icon: SiHulu, color: "text-green-500" },
  337: { Icon: undefined },
  350: { Icon: SiAppletv },
};

interface WatchProviderProps {
  provider: Provider & ProviderUI;
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
  watchProviders: Provider[];
}

const WatchProviders: FC<Props> = ({ watchProviders }) => {
  const providers = watchProviders
    .filter((p) => p.display_priority <= 6)
    .map((p) => ({ ...p, ...PROVIDER_RENDER_DETAILS[p.provider_id] }));

  if (providers.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap items-center mx-auto gap-2">
        {providers.map((provider) => {
          return <WatchProvider key={provider.provider_id} provider={provider} />;
        })}
      </div>
    </div>
  );
};

export default WatchProviders;
