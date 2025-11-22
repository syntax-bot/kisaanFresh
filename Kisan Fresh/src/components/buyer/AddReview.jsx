import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";

const AddReview = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { item, purchase } =
    location.state || {};

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/buyer/review/add/",
        {
          purchase_item_id: item.id,
          comment,
          rating,
        },
        { withCredentials: true }
      );

      toast.success("Review submitted!");
      // onSuccess();
      // onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold text-green-700 text-center">
          Review: {item}
        </h2>

        {/* Rating Stars */}
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${
                rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment Input */}
        <textarea
          className="border w-full mt-4 p-2 rounded"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            // onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? <Loader width={20} height={20} /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
