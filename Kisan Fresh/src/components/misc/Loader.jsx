import React from "react";
import { Circles } from "react-loader-spinner";

const Loader = ({ width = 20, height = 20 }) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Circles
        height={height}
        width={width}
        radius={1}
        color="black"
        ariaLabel="audio-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
