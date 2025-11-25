import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import BiddingCard from "./BiddingCard";
import { useNavigate } from "react-router-dom";

const BiddingItemPage = () => {
  const [biddingItems, setBiddingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const socketRef = useRef({}); // Stores all sockets

  // --------------------------------------------------------
  // Fetch live bids
  // --------------------------------------------------------
  const fetchLiveBids = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/bidding/nearby/", {
        withCredentials: true,
      });

      const items = (res.data.live_bidding || []).map((item) => ({
        ...item,
        current_highest_bid: item.current_highest_bid || item.min_bid_price,
      }));

      setBiddingItems(items);
      setLoading(false);
    } catch (err) {
      setError("Failed to load live bidding data");
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchLiveBids(); // fetch once
}, []);


  // --------------------------------------------------------
  // Handle incoming WS broadcast
  // --------------------------------------------------------
  const handleIncoming = useCallback((data) => {
    if (!data?.vegetable_id) return;

    setBiddingItems((prev) =>
      prev.map((item) =>
        item.vegetable_id === data.vegetable_id
          ? {
              ...item,
              current_highest_bid: data.new_highest_bid,
              highest_bidder: data.highest_bidder,
            }
          : item
      )
    );
  }, []);

  // --------------------------------------------------------
  // Establish WebSocket connections ONCE per vegetable
  // --------------------------------------------------------
  useEffect(() => {
    biddingItems.forEach((item) => {
      const vegId = item.vegetable_id;

      // If socket already exists → skip
      if (socketRef.current[vegId]) return;

      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/bid/${vegId}/`);

      ws.onopen = () => console.log("WS OPENED →", vegId);
      ws.onerror = (err) => console.log("WS ERROR →", vegId, err);
      ws.onclose = (ev) => console.log("WS CLOSED →", vegId, ev.code);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleIncoming(data);
        } catch (err) {
          console.error("WS Parse Error", err);
        }
      };

      socketRef.current[vegId] = ws; // Save reference
    });
  }, [biddingItems, handleIncoming]);

  // --------------------------------------------------------
  // Cleanup ALL WS only when component unmounts
  // --------------------------------------------------------
  useEffect(() => {
    return () => {
      console.log("Unmount → Closing all sockets");
      Object.values(socketRef.current).forEach((ws) => ws.close());
    };
  }, []);

  // --------------------------------------------------------
  // Bid placement
  // --------------------------------------------------------
  const [bidAmount, setBidAmount] = useState({});

  const handleBidChange = (vegId, value) =>
    setBidAmount((prev) => ({ ...prev, [vegId]: value }));

  const placeBid = async (veg) => {
    const amount = parseFloat(bidAmount[veg.vegetable_id]);

    if (!amount || amount <= parseFloat(veg.current_highest_bid)) {
      alert("Bid must be greater than current highest bid!");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/bidding/place-bid/",
        { bid_id: veg.bid_id, amount },
        { withCredentials: true }
      );

      alert("Bid placed!");

      // Temporary optimistic update
      setBiddingItems((prev) =>
        prev.map((i) =>
          i.vegetable_id === veg.vegetable_id
            ? { ...i, current_highest_bid: amount }
            : i
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Error placing bid");
    }
  };

  // --------------------------------------------------------
  // Render UI
  // --------------------------------------------------------
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!biddingItems.length)
    return (
      <>
      <div className="flex justify-center gap-8 mb-10">
        <button onClick={() => navigate("/customer/nearby_upcoming_bids")} className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-700 transition-all font-medium">
          Upcoming Bids
        </button>
        <button onClick={() => navigate("/customer/completed_bids")} className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-700 transition-all font-medium">
          My Bid History
        </button>
      </div>
      <div className="p-6 text-center text-gray-600">No live auctions near you</div>
      </>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-center gap-8 mb-10">
        <button onClick={() => navigate("/customer/nearby_upcoming_bids")} className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-700 transition-all font-medium">
          Upcoming Bids
        </button>
        <button onClick={() => navigate("/customer/completed_bids")} className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-700 transition-all font-medium">
          My Bid History
        </button>
      </div>
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Live Auctions Near You
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {biddingItems.map((veg) => (
          <BiddingCard
            key={veg.bid_id}
            veg={veg}
            placeBid={placeBid}
            handleBidChange={handleBidChange}
          />
        ))}
      </div>
    </div>
  );
};

export default BiddingItemPage;
