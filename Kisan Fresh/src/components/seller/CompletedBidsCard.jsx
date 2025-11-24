import React from "react";

const CompletedBidCard = ({ bid }) => {
  const fmt = (d) => {
    try {
      return d ? new Date(d).toLocaleString() : "—";
    } catch {
      return "—";
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="text-lg font-semibold text-green-700">
        {bid.vegetable_name || "Vegetable"}
      </h2>

      <p className="text-sm text-gray-600 mt-1">
        Winner: <span className="font-medium">{bid.winner_email || "—"}</span>
      </p>

      <div className="mt-3 text-sm space-y-1">
        <p>
          <span className="font-semibold">Final Amount:</span>{" "}
          {typeof bid.final_amount !== "undefined" ? `₹${bid.final_amount}` : "—"}
        </p>

        <p>
          <span className="font-semibold">Minimum Bid Price:</span>{" "}
          {bid.min_bid_price ? `₹${bid.min_bid_price}` : "—"}
        </p>

        <p>
          <span className="font-semibold">Started:</span> {fmt(bid.starting_time)}
        </p>

        <p>
          <span className="font-semibold">Ended:</span> {fmt(bid.ending_time)}
        </p>

        <p className="mt-1 text-blue-700 font-semibold">
          Won At: {fmt(bid.winning_time)}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Bid ID: {bid.bid_id ?? "—"} • Winner ID: {bid.winner_id ?? "—"}
        </p>
      </div>
    </div>
  );
};

export default CompletedBidCard;
