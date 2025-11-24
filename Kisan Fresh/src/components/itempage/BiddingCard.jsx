import React from "react";
import Countdown from "../../hooks/CountDown";

const BiddingCard = ({ veg, placeBid, handleBidChange }) => {

  const countdown = Countdown(veg.ending_time);

  return (
    <div className="bg-white p-4 rounded shadow border">
      {veg.image && (
        <img
          src={`http://127.0.0.1:8000${veg.image}`}
          className="w-full h-32 object-cover rounded"
        />
      )}

      <h2 className="text-lg font-semibold mt-2">{veg.name}</h2>
      <p className="text-sm text-gray-500">{veg.description}</p>

      <p className="mt-1 text-green-700 font-bold">
        Min Bid: ₹{veg.min_bid_price}/{veg.unit}
      </p>

      <p className="font-semibold text-blue-600 mt-2">
        Time Left:{" "}
        {countdown.expired
          ? "Expired"
          : `${countdown.minutes}m : ${countdown.seconds}s`}
      </p>

      <p className="text-orange-600 font-bold mt-2">
        Highest Bid: ₹{veg.current_highest_bid}
      </p>

      <input
        type="number"
        className="border rounded w-full px-3 py-1 mt-3"
        placeholder="Enter your bid"
        onChange={(e) => handleBidChange(veg.vegetable_id, e.target.value)}
      />

      <button
        className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700"
        onClick={() => placeBid(veg)}
      >
        Place Bid
      </button>
    </div>
  );
};

export default BiddingCard;
