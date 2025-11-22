import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";

const ProcessingPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const fetchProcessingPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/seller/orders/processing/",
        { withCredentials: true }
      );
      console.log(res);
      setOrders(res.data.processing_orders?.reverse() || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load processing orders");
      toast.error("Login required or server error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProcessingPurchases();
  }, []);

  const handleMarkComplete = async (purchaseId) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/seller/complete_order/${purchaseId}/`,
        { withCredentials: true }
      );
      console.log(res);
      toast.success("Order marked as complete");
      fetchProcessingPurchases();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to mark order complete");
      toast.error("Login required or server error");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        <Loader width={40} height={40} />
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-semibold">No processing orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-20">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-10">
        Processing Orders
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.purchase_id}
            className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <p>
                <span className="font-semibold">Seller:</span> {order.seller_email}
              </p>
              <p className="text-sm text-gray-500">{order.created_at}</p>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Order Items:</h3>
              <ul className="space-y-1 text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.vegetable_name} ({item.quantity} units)
                    </span>
                    <span>₹{item.total_price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between text-lg font-bold text-blue-700">
              <span>Total:</span>
              <span>₹{order.total_price}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-sm rounded-lg ${
                    order.status === "Processing"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3">
                <button
                  className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded-lg"
                  onClick={() => {
                    setSelectedOrder(order.purchase_id);
                    setShowDialog(true);
                  }}
                >
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        ))}

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-green-600">Mark Order Complete</h3>
              <p className="text-gray-500 mt-2">Are you sure you want to mark this order as complete?</p>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowDialog(false)}
                >
                  Close
                </button>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleMarkComplete(selectedOrder);
                    setShowDialog(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingPurchases;