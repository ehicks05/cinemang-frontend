import React from "react";
import Loader from "react-loader-spinner";

const Loading = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center flex-grow">
        <Loader type="Rings" color="#15eda1" height={256} width={256} />
      </div>
    );
  }

  if (error) {
    return <span>Error: {JSON.stringify(error, null, 2)}</span>;
  }
};

export default Loading;
