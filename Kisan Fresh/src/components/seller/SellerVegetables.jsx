import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerVegetables = () => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch seller vegetables
  const fetchVegetables = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/seller/my_vegetables/",
        { withCredentials: true } // Important for sending session cookie
      );
      setVegetables(res.data.vegetables || []);
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

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-lg font-semibold">
        Loading Vegetables...
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
              ₹{veg.price} / {veg.unit}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Stock: <span className="font-semibold">{veg.stock}</span>
            </p>
            <p className="text-gray-500 text-sm">
              {veg.freshness_level}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerVegetables;
