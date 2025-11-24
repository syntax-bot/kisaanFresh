import React, { useEffect, useState } from "react";
import axios from "axios";
import BiddingCard from "./BiddingCard";

const UpcomingBiddingItemPage = () => {
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpcoming = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/bidding/get_nearby_upcoming_bids/", {
        withCredentials: true,
      });

      // normalize data similar to live: ensure current_highest_bid exists
      const items = (res.data.upcoming_bidding || []).map((item) => ({
        ...item,
        current_highest_bid: item.current_highest_bid || item.min_bid_price,
      }));

      setUpcomingItems(items);
      setLoading(false);
    } catch (err) {
      setError("Failed to load upcoming auctions");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    // optional: refresh every 30s to pick up new items / changed start_time
    const id = setInterval(fetchUpcoming, 30000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div className="p-6 text-center">Loading upcoming auctions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!upcomingItems.length)
    return (
      <div className="p-6 text-center text-gray-600">No upcoming auctions scheduled</div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Upcoming Auctions</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {upcomingItems.map((veg) => (
          <BiddingCard
            key={veg.bid_id}
            veg={veg}
            mode="upcoming"
            // pass placeBid and handlers if you support pre-bid; otherwise pass noop
            placeBid={() => {}}
            handleBidChange={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingBiddingItemPage;