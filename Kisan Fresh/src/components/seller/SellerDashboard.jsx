import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";
import { useDispatch } from "react-redux";
import {logout} from "../../feature/userSlice.js"

const SellerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/seller_logout/", {},{
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      console.log(res);
      dispatch(logout());
      navigate("/seller/login");
    } catch (err) {
      console.log(err)
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 border border-green-200">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Dashboard
        </h1>

        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => navigate("/seller/profile")}
            className="py-3 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/seller/my_bid_veg")}
            className="py-3 w-full bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors shadow-sm"
          >
            Bid Bazar
          </button>
          <button
            onClick={() => navigate("/seller/sell_analytics")}
            className="py-3 w-full bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-sm"
          >
            Sell Analytics
          </button>

          <button
            onClick={() => navigate("/seller/pending_purchases")}
            className="py-3 w-full bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
          >
            Pending Orders
          </button>
          <button
            onClick={() => navigate("/seller/processing_purchases")}
            className="py-3 w-full bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            Processing Orders
          </button>

          <button
            onClick={() => navigate("/seller/completed_purchases")}
            className="py-3 w-full bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Completed Orders
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;