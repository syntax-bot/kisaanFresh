import React from "react";
import RatingStars from "../../assets/RatingStars";

function Rating({ rating }) {
  var arr = [0, 1, 2, 3, 4];
  return (
    <>
      <div className="rating my-2 flex items-center">
        <span className="  rounded bg-secondary px-2.5 py-0.5 text-xs font-semibold text-text">
          {Number(rating).toFixed(1)}
        </span>
        <div className="flex ml-1 items-center">
          {arr.map((ele) => (
            <div key={ele}>
              <RatingStars star={rating - ele} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Rating;
