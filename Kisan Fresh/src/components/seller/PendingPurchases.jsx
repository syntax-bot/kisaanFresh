import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";

const PendingPurchases = () => {
 const [orders, setOrders] = useState([
  {
    purchase_id: 101,
    buyer_email: "rahul@example.com",
    created_at: "2025-11-22 10:30 AM",
    status: "Pending",
    total_price: 450,
    items: [
      {
        vegetable_name: "Tomato",
        quantity: 5,
        total_price: 150,
      },
      {
        vegetable_name: "Potato",
        quantity: 10,
        total_price: 300,
      },
    ],
  },
  {
    purchase_id: 102,
    buyer_email: "neha@example.com",
    created_at: "2025-11-21 5:45 PM",
    status: "Pending",
    total_price: 220,
    items: [
      {
        vegetable_name: "Onion",
        quantity: 4,
        total_price: 120,
      },
      {
        vegetable_name: "Capsicum",
        quantity: 2,
        total_price: 100,
      },
    ],
  },
  {
    purchase_id: 103,
    buyer_email: "arjun@example.com",
    created_at: "2025-11-20 8:15 AM",
    status: "Pending",
    total_price: 130,
    items: [
      {
        vegetable_name: "Carrot",
        quantity: 3,
        total_price: 90,
      },
      {
        vegetable_name: "Cucumber",
        quantity: 2,
        total_price: 40,
      },
    ],
  },
]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"

  const fetchPendingPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/seller/orders/pending/",
        { withCredentials: true }
      );
      setOrders(res.data.pending_orders?.reverse() || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load pending orders");
      toast.error("Login required or server error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingPurchases();
  }, []);

  const handleAcceptOrder = async (purchaseId) => {
    setLoading(true);
    try {
      await axios.get(
        `http://127.0.0.1:8000/seller/accept_orders/${purchaseId}/`,
        { withCredentials: true }
      );
      toast.success("Order accepted");
      fetchPendingPurchases();
    } catch (err) {
      toast.error("Failed to accept order");
    }
    setLoading(false);
  };

  const handleRejectOrder = async (purchaseId) => {
    setLoading(true);
    try {
      await axios.get(
        `http://127.0.0.1:8000/seller/reject_orders/${purchaseId}/`,
        { withCredentials: true }
      );
      toast.success("Order rejected");
      fetchPendingPurchases();
    } catch (err) {
      toast.error("Failed to reject order");
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
        <p className="text-lg font-semibold">No pending orders found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-20">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-10">
        Pending Purchases
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.purchase_id}
            className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <p>
                <span className="font-semibold">Buyer:</span>{" "}
                {order.buyer_email}
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
              <span
                className={`px-3 py-1 text-sm rounded-lg bg-yellow-200 text-yellow-800`}
              >
                {order.status}
              </span>

              <div className="flex gap-2">
                {/* Accept Button */}
                <button
                  className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded-lg"
                  onClick={() => {
                    setSelectedOrder(order.purchase_id);
                    setActionType("accept");
                    setShowDialog(true);
                  }}
                >
                  Accept
                </button>

                {/* Reject Button */}
                <button
                  className="px-3 py-1 text-sm bg-red-200 text-red-800 rounded-lg"
                  onClick={() => {
                    setSelectedOrder(order.purchase_id);
                    setActionType("reject");
                    setShowDialog(true);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Confirmation Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-blue-600">
                {actionType === "accept"
                  ? "Accept Order"
                  : "Reject Order"}
              </h3>

              <p className="text-gray-500 mt-2">
                Are you sure you want to{" "}
                <span className="font-semibold text-red-600">
                  {actionType}
                </span>{" "}
                this order?
              </p>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowDialog(false)}
                >
                  Close
                </button>

                <button
                  className={`px-4 py-2 text-white rounded ${
                    actionType === "accept"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                  onClick={() => {
                    if (actionType === "accept")
                      handleAcceptOrder(selectedOrder);
                    else handleRejectOrder(selectedOrder);

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

export default PendingPurchases;
