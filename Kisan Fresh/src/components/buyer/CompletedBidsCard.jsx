import React from "react";

const CompletedBidCard = ({ bid }) => {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <h2 className="text-lg font-semibold text-green-700">
        {bid.vegetable_name}
      </h2>

      <p className="text-sm text-gray-600 mt-1">
        Seller: <span className="font-medium">{bid.seller_email}</span>
      </p>

      <div className="mt-3 text-sm">
        <p>
          <span className="font-semibold">Final Amount:</span> ₹
          {bid.final_amount}
        </p>
        <p>
          <span className="font-semibold">Minimum Bid Price:</span> ₹
          {bid.min_bid_price}
        </p>

        <p className="mt-2">
          <span className="font-semibold">Started:</span>{" "}
          {new Date(bid.starting_time).toLocaleString()}
        </p>

        <p>
          <span className="font-semibold">Ended:</span>{" "}
          {new Date(bid.ending_time).toLocaleString()}
        </p>

        <p className="mt-2 text-blue-700 font-semibold">
          Won At: {new Date(bid.winning_time).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CompletedBidCard;