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
        "http://127.0.0.1:8000/bidding/buyer_completed_bids/",
        { withCredentials: true }
      );
      setBids(res.data.my_completed_bids || []);
      setLoading(false);
    } catch (err) {
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
