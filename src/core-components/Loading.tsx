import { FC } from "react";
import { Oval } from "react-loader-spinner";

interface Props {
  loading: boolean;
  error: any;
  size?: number;
}

const Loading: FC<Props> = ({ loading, error, size = 256 }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <Oval color="#15eda1" height={size} width={size} />
      </div>
    );
  }

  if (error) {
    return <span>Error: {JSON.stringify(error, null, 2)}</span>;
  }

  return null;
};

export default Loading;
