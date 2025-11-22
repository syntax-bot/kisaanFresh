import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";

const CompletedPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompletedPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/seller/purchases/completed",
        { withCredentials: true }
      );
      console.log(res);
      setOrders(res.data.completed_orders?.reverse() || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load completed orders");
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
        <p className="text-lg font-semibold">No completed orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-20">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-10">
        Completed Orders
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
              <span className="px-3 py-1 text-sm rounded-lg bg-green-200 text-green-800">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedPurchases;