import { FC } from "react";
import { VscLoading } from "react-icons/vsc";

interface Props {
  loading: boolean;
  error: any;
  size?: number;
}

const Loading: FC<Props> = ({ loading, error, size = 128 }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <VscLoading className="animate-spin" color="#15eda1" size={size} />
      </div>
    );
  }

  if (error) {
    return <span>Error: {JSON.stringify(error, null, 2)}</span>;
  }

  return null;
};

export default Loading;
