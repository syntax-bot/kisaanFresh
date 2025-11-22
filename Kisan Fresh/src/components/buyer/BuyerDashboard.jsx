import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../misc/Loader";
import { useDispatch } from "react-redux";
import { logout } from "../../feature/userSlice";

const BuyerDashboard = () => {
  // const [buyer, setBuyer] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   // Fetch logged-in buyer profile
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await axios.get("http://127.0.0.1:8000/buyer_profile/", {
  //         withCredentials: true,
  //       });
  //       console.log(res);
  //       setBuyer(res.data.profile);
  //     } catch (err) {
  //       toast.error("Please login first!");
  //       navigate("/customer/login");
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     fetchProfile();
  //   }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/buyer_logout/", {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      dispatch(logout());
      navigate("/customer/login");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  // if (loading)
  //   return (
  //     <div className="flex justify-center py-20">
  //       <Loader width={40} height={40} />
  //     </div>
  //   );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 border">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Dashboard
        </h1>

        {/* <div className="text-center mb-10">
          <p className="text-xl font-semibold">{buyer.name}</p>
          <p className="text-gray-600">{buyer.email}</p>
        </div> */}

        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => navigate("/customer/profile")}
            className="py-3 w-full bg-blue-400 text-white rounded-lg hover:bg-blue-600"
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/customer/pending_purchases")}
            className="py-3 w-full bg-yellow-400 text-white rounded-lg hover:bg-yellow-600"
          >
            Pending Purchases
          </button>

          <button
            onClick={() => navigate("/customer/completed_purchases")}
            className="py-3 w-full bg-green-400 text-white rounded-lg hover:bg-green-600"
          >
            Completed Orders
          </button>

          <button
            onClick={() => navigate("/customer/cart")}
            className="py-3 w-full bg-purple-400 text-white rounded-lg hover:bg-purple-600"
          >
            Cart
          </button>
          <button
            onClick={() => navigate("/customer/analysis")}
            className="py-3 w-full bg-sky-400 text-white rounded-lg hover:bg-sky-600"
          >
            Analysis
          </button>

          <button
            onClick={handleLogout}
            className="w-full  py-3 bg-red-400 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
