import React, { useEffect, useState } from "react";
import axios from "axios";
import CompletedBidCard from "./CompletedBidsCard";


const CompletedBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompletedBids = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/bidding/seller_completed_bids/",
        { withCredentials: true }
      );
      setBids(res.data.my_completed_bids || []);
    //   setBids([
    //   {
    //     bid_id: 101,
    //     vegetable_name: "Carrot",
    //     min_bid_price: "20",
    //     final_amount: "38",
    //     starting_time: "2025-01-10T10:00:00Z",
    //     ending_time: "2025-01-10T11:00:00Z",
    //     winning_time: "2025-01-10T11:00:05Z",
    //     winner_email: "harsh@example.com",
    //     winner_id: 77,
    //   },
    //   {
    //     bid_id: 102,
    //     vegetable_name: "Potato",
    //     min_bid_price: "15",
    //     final_amount: "25",
    //     starting_time: "2025-01-11T09:00:00Z",
    //     ending_time: "2025-01-11T10:00:00Z",
    //     winning_time: "2025-01-11T10:00:04Z",
    //     winner_email: "harsh@example.com",
    //     winner_id: 77,
    //   },
    //   {
    //     bid_id: 103,
    //     vegetable_name: "Onion",
    //     min_bid_price: "18",
    //     final_amount: "29",
    //     starting_time: "2025-01-09T08:00:00Z",
    //     ending_time: "2025-01-09T09:00:00Z",
    //     winning_time: "2025-01-09T09:00:01Z",
    //     winner_email: "harsh@example.com",
    //     winner_id: 77,
    //   },
    // ]);

    setLoading(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load your completed bids");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedBids();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!bids.length)
    return (
      <div className="p-6 text-gray-600 text-center">
        No completed bids found.
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-5">
        My Completed Bids
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bids.map((bid) => (
          <CompletedBidCard key={bid.bid_id} bid={bid} />
        ))}
      </div>
    </div>
  );
};

export default CompletedBidsPage;