import React, { useEffect, useState } from "react";
import axios from "axios";

const BiddingItemPage = () => {
  const [biddingItems, setBiddingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState({});

  const fetchLiveBiddingVeggies = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/bidding/nearby/",
        { withCredentials: true }
      );
      setBiddingItems(res.data.live_bidding || []);
    } catch (err) {
      setError("Failed to load bidding vegetables");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveBiddingVeggies();

    // auto refresh every 30s
    const interval = setInterval(fetchLiveBiddingVeggies, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBidChange = (vegId, value) => {
    setBidAmount(prev => ({ ...prev, [vegId]: value }));
  };

  const placeBid = async (veg) => {
    const amount = bidAmount[veg.vegetable_id];
    if (!amount || amount <= veg.min_bid_price) {
      alert("Bid must be greater than minimum bid price!");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/bidding/place-bid/",
        {
          bid_id: veg.bid_id,
          amount: amount,
        },
        { withCredentials: true }
      );

      alert(res.data.message || "Bid placed successfully!");
      fetchLiveBiddingVeggies(); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong!");
    }
  };

  const renderCountdown = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m : ${secs}s`;
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (biddingItems.length === 0)
    return <div className="p-6 text-center text-gray-500">No live bids nearby</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Live Bidding Near You 🥕
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {biddingItems.map((veg) => (
          <div key={veg.bid_id} className="bg-white shadow p-4 rounded-lg border">
            {veg.image && (
              <img
                src={`http://127.0.0.1:8000${veg.image}`}
                alt={veg.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}

            <h3 className="text-lg font-semibold">{veg.name}</h3>
            <p className="text-sm text-gray-600">{veg.description}</p>
            <p className="mt-1 text-green-700 font-bold">
              Min Bid: ₹{veg.min_bid_price}/{veg.unit}
            </p>
            <p className="text-xs text-gray-500">
              Distance: {veg.distance_km} km away
            </p>

            <p className="font-semibold text-blue-600 mt-2">
              Time Left: {renderCountdown(veg.ending_time)}
            </p>

            <input
              type="number"
              className="border rounded w-full px-3 py-1 mt-3"
              placeholder="Enter your bid"
              onChange={(e) =>
                handleBidChange(veg.vegetable_id, e.target.value)
              }
            />

            <button
              className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700"
              onClick={() => placeBid(veg)}
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiddingItemPage;
