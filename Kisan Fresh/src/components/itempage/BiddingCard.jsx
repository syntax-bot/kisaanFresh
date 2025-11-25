// src/components/BiddingCard.jsx
import React from "react";
import Countdown from "../../hooks/CountDown";

const BiddingCard = ({ veg, placeBid, handleBidChange, mode = "live" }) => {
  // mode: "live" or "upcoming"
  const isUpcoming = mode === "upcoming";
  // For live auctions use ending_time; for upcoming show start_time
  const countdown = Countdown(isUpcoming ? veg.start_time : veg.ending_time);

  return (
    <div className="bg-white p-4 rounded shadow border">
      {veg.image && (
        <img
          src={`http://127.0.0.1:8000${veg.image}`}
          alt={veg.name}
          className="w-full h-32 object-cover rounded"
        />
      )}

      <h2 className="text-lg font-semibold mt-2">{veg.name}</h2>
      <p className="text-sm text-gray-500">{veg.description}</p>

      <p className="mt-1 text-green-700 font-bold">
        Min Bid: ₹{veg.min_bid_price}/{veg.unit}
      </p>

      
      {isUpcoming ? (
        <p className="font-semibold text-blue-600 mt-2">
        {isUpcoming ? "Starts At: " : "Time Left: "}
        {countdown.expired
          ? isUpcoming
            ? "Started"
            : "Expired"
          : `${veg.starting_time}`}
      </p>
      ):(<p className="font-semibold text-blue-600 mt-2">
        {isUpcoming ? "Starts In: " : "Time Left: "}
        {countdown.expired
          ? isUpcoming
            ? "Started"
            : "Expired"
          : `${countdown.minutes}m : ${countdown.seconds}s`}
      </p>)}

      <p className="text-orange-600 font-bold mt-2">
        <p>
  {isUpcoming 
    ? `Starting Bid: ₹${veg.current_highest_bid}` 
    : `Highest Bid: ₹${veg.current_highest_bid}` }
</p>

      </p>

      {/* If it's upcoming, disable bid input or optionally show pre-bid UI */}
      <input
        type="number"
        className={`border rounded w-full px-3 py-1 mt-3 ${isUpcoming ? " cursor-not-allowed bg-primary" : ""}`}
        placeholder={isUpcoming ? "Bidding opens when sale starts" : "Enter your bid"}
        onChange={(e) => handleBidChange(veg.vegetable_id, e.target.value)}
        disabled={isUpcoming}
      />

      {isUpcoming ? (
        <div className="flex gap-2 mt-2">
          
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700"
          onClick={() => placeBid(veg)}
        >
          Place Bid
        </button>
      )}
    </div>
  );
};

export default BiddingCard;
