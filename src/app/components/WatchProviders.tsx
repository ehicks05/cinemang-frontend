import { FC } from "react";
import { IconType } from "react-icons";
import { SiAmazon, SiAppletv, SiHulu, SiNetflix } from "react-icons/si";

interface Provider {
  id: number;
  name: string;
  Icon?: IconType;
  color?: string;
  colorStyle?: string;
}

const PROVIDERS: Record<number, Provider> = {
  8: { id: 8, name: "Netflix", Icon: SiNetflix, color: "text-netflix" },
  9: {
    id: 9,
    name: "Amazon Prime Video",
    Icon: SiAmazon,
    color: "text-amazon",
  },
  15: { id: 15, name: "Hulu", Icon: SiHulu, colorStyle: "#66aa33" },
  337: { id: 337, name: "Disney+", Icon: undefined, color: "text-white" },
  350: { id: 350, name: "Apple TV Plus", Icon: SiAppletv, color: "text-white" },
};

interface WatchProviderProps {
  provider: Provider;
}

const WatchProvider: FC<WatchProviderProps> = ({ provider }) => {
  const { Icon, name, color, colorStyle } = provider;
  return (
    <div
      className="flex p-1 rounded border border-solid border-gray-600"
      style={{ color: colorStyle }}
    >
      <div className="flex">
        {Icon && <Icon className={`${color} text-xl`} />}
        {!Icon && <span className={`${color} text-xs`}>{name}</span>}
      </div>
    </div>
  );
};

interface Props {
  watchProviders: { provider_id: number }[];
}

const WatchProviders: FC<Props> = ({ watchProviders }) => {
  if (!watchProviders) return null;
  const providers = watchProviders
    .map((p) => PROVIDERS[p.provider_id])
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
