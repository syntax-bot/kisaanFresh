import React from "react";

function Thumbnail({ src, alt }) {
  return (
    <div>
      <img
        class=" object-cover w-20 h-20 rounded cursor-pointer border"
        src={src}
        alt={alt}
      />
    </div>
  );
}

export default Thumbnail;
