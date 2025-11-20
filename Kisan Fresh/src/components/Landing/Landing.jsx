import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-inter">
      <div className="w-full max-w-2xl text-center">
        {/* LOGO */}
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
          Welcome to KisanFresh
        </h1>

        <p className="text-muted text-sm sm:text-base max-w-lg mx-auto mb-10">
          KisanFresh connects local farmers, sellers, and customers through a
          simple and trusted platform. Buy fresh. Sell smart. Support local.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/customer/login")}
            className="px-8 py-4 rounded-lg text-lg font-semibold bg-primary text-white hover:brightness-95 shadow-md"
          >
            Customer
          </button>

          <button
            onClick={() => navigate("/seller/login")}
            className="px-8 py-4 rounded-lg text-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-white transition shadow-md"
          >
            Seller
          </button>
        </div>
      </div>
    </div>
  );
}
