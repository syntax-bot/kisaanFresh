import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LineWave } from "react-loader-spinner";
import { Link } from "react-router";

const CompletedPurchases = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleReviewSubmit = async (purchaseId, itemId, comment, rating) => {
    if(rating === 0){
      toast.error("Please provide a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      console.log({itemId , purchaseId})
      await axios.post(
        "http://127.0.0.1:8000/buyer/review/add/",
        {
          purchase_item_id: itemId,
          comment,
          rating,
        },
        { withCredentials: true }
      );
      toast.success("Review submitted!");
      fetchCompletedPurchases(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    }
  };



  const fetchCompletedPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/buyer/purchases/completed/",
        { withCredentials: true }
      );
      console.log(res.data);
      setPurchases(res.data.completed_purchases || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load purchases");
      toast.error("Login required or server error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedPurchases();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading purchases...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-semibold">No completed purchases found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-20">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
        Completed Purchases
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {purchases.map((purchase) => (
          <div
            key={purchase.purchase_id}
            className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <p>
                <span className="font-semibold">Seller:</span>{" "}
                {purchase.seller_name}
              </p>
              <p className="text-sm text-gray-500">{purchase.created_at}</p>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
              <ul className="space-y-1 text-gray-700">
                {purchase.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {item.vegetable_name} ({item.quantity} units)
                    </span>
                    <span>
                      ₹{item.total_price}
                      <button
                        onClick={() => {
                          setShowDialog(true)
                          setSelectedItem(item.item_id)
                          setSelectedPurchase(purchase.purchase_id)
                        }}
                        className="ml-4 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        review
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between text-lg font-bold text-green-700">
              <span>Total:</span>
              <span>₹{purchase.total_price}</span>
            </div>

            <div className="mt-3">
              <span
                className={`px-3 py-1 text-sm rounded-lg ${
                  purchase.status === "Completed"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {purchase.status}
              </span>
            </div>
          </div>
        ))}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
              {/* Title */}
              <h3 className="text-xl font-bold text-green-600 text-center">
                Rate & Review
              </h3>

              {/* Stars */}
              <div className="flex justify-center mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-3xl ${
                      rating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment Box */}
              <textarea
                className="w-full border border-gray-300 rounded p-2 mt-4 focus:ring focus:ring-green-300"
                rows="3"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowDialog(false);
                    setSelectedItem(null);
                    setSelectedPurchase(null);
                    setComment("");
                    setRating(0);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    console.log({selectedItem, selectedPurchase, comment, rating});
                    handleReviewSubmit(
                      selectedPurchase,
                      selectedItem,
                      comment,
                      rating
                    );
                    setShowDialog(false);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedPurchases;
