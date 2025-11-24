import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../misc/Loader";

const My_Bidding_Veg = () => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch seller vegetables
  const fetchVegetables = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/bidding/bid_veg_data/",
        { withCredentials: true } // Important for sending session cookie
      );
      console.log(res)
      setVegetables(res.data.bidding_vegetables || []);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Server error");
      } else {
        setError("Failed to connect to server");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVegetables();
  }, []);
const [showModal, setShowModal] = useState(false);
const [selectedVegId, setSelectedVegId] = useState(null);
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [submitLoading, setSubmitLoading] = useState(false);

const openBidForm = (vegId) => {
  setSelectedVegId(vegId);
  setShowModal(true);
};

const closeBidForm = () => {
  setShowModal(false);
  setSelectedVegId(null);
  setStartTime("");
  setEndTime("");
};

const createBid = async (e) => {
  e.preventDefault();
  setSubmitLoading(true);

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Validation Rules
  if (start <= now) {
    alert("Start time must be in the future!");
    setSubmitLoading(false);
    return;
  }

  const oneDayLater = new Date(now);
  oneDayLater.setDate(now.getDate() + 1);

  // if (start < oneDayLater) {
  //   alert("Start time must be at least 1 day from now!");
  //   setSubmitLoading(false);
  //   return;
  // }

  if (end <= start) {
    alert("End time must be later than start time!");
    setSubmitLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/bidding/create-bid/",
      {
        vegetable_id: selectedVegId,
        starting_time: startTime,
        ending_time: endTime,
      },
      { withCredentials: true }
    );

    alert(res.data.message || "Bid created!");
    closeBidForm();
    fetchVegetables();
  } catch (err) {
    alert(err.response?.data?.error || "Error creating bid");
  }

  setSubmitLoading(false);
};

const cancelBid = async (bidId) => {
  try {
    await axios.delete(
      `http://127.0.0.1:8000/bidding/Cancel_Bid/${bidId}/`,
      { withCredentials: true }
    );
    fetchVegetables(); // refresh UI after cancel
  } catch (err) {
    console.error(err.response?.data);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-lg font-semibold">
        <Loader width={40} height={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchVegetables}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (vegetables.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p className="text-lg font-semibold">No vegetables added yet.</p>
        <p className="text-sm">Add vegetables to see them here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
        Your Vegetables
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
        {vegetables.map((veg) => (
          <div
            key={veg.id}
            className="bg-white shadow-md border rounded-lg p-4 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{veg.name}</h2>
            <p className="text-gray-600 text-sm">{veg.variety}</p>
            <p className="text-green-600 font-bold mt-2">
                    ₹{veg.min_bid_price}  
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Stock: <span className="font-semibold">{veg.stock} {veg.unit}</span>
            </p>
            <p className="text-gray-500 text-sm">
              {veg.description}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Added: {veg.created_at}
            </p>

            <div className="mt-4">
              <span
                className={`px-3 py-1 text-sm rounded-lg ${
                  veg.is_available
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {veg.is_available ? "Available" : "Not Available"}
                    </span>
                    {/* Create or Cancel Bid Button */}
  {veg.bid_id!=null ? (
    <button
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      onClick={() => cancelBid(veg.bid_id)}
    >
      Cancel Bid
    </button>
  ) : (
    <button
      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      onClick={() => openBidForm(veg.id)}
    >
      Create Bid
    </button>
  )}

            </div>
          </div>
        ))}
          </div>
          {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Create Bid</h2>

      <form onSubmit={createBid} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={closeBidForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {submitLoading ? "Saving..." : "Create Bid"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default My_Bidding_Veg;


