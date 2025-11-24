import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { useDispatch } from "react-redux";
import { login } from "../../../feature/userSlice.js";
import Loader from "../../misc/Loader.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading,setLoading] = useState(false);

  const [deatails, setDeatails] = useState({
    phoneNumber: "",
    email: "",
  });

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  // regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailIsValid = emailRegex.test(deatails.email);

  const canContinue = emailIsValid;

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setDeatails((prev) => ({ ...prev, [name]: value }));
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Submit details
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("email", deatails.email);
      const res = await axios.post(
        "http://127.0.0.1:8000/request_otp_seller/",
        form,
        { withCredentials: true }
      );
      if(res.data.error){
        setLoading(false);
        setError(res.data.error);
        return;
      }
      console.log(res.data);
      startTimer();
      setStep(2);
      setError("");
      setLoading(false);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Server error occurred");
      } else if (err.request) {
        setError("No response from server. Check server is running.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
    setLoading(false);
  };

  // Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let otpIsValid = false;
    let data = null;
    try {
      const form = new FormData();
      form.append("email", deatails.email);
      form.append("otp", otp);
      const res = await axios.post(
        "http://127.0.0.1:8000/seller_login/",
        form,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      otpIsValid = !res.data.error;
      data = res.data;
      setLoading(false);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Server error occurred");
      } else if (err.request) {
        setError("No response from server.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    }

    // reset OTP field
    setOtp("");

    if (otpIsValid) {
      toast("OTP verified!");
      console.log(data);
      dispatch(login(data));
      navigate("/seller/my_vegies");
    } else {
      setError("Invalid OTP. Try again.");
    }
    setLoading(false);
  };

  const inputBase =
    "relative block w-full appearance-none border px-3 py-3 text-text placeholder-muted focus:z-10 focus:outline-none sm:text-sm rounded-md";
  const validClass =
    "border-green-500 focus:border-green-500 focus:ring-green-500";
  const invalidClass = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const neutralClass =
    "border-gray-300 focus:border-primary focus:ring-primary";

  return (
    <div className="flex items-center justify-center bg-background font-inter min-h-screen p-6">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-surface p-10 shadow-lg">
        {/* getting deatils for register */}
        {step === 1 && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
              Sign in to your account
            </h2>

            <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit}>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={deatails.email}
                  onChange={handleInputChange}
                  className={`${inputBase} ${
                    deatails.email === ""
                      ? neutralClass
                      : emailIsValid
                      ? validClass
                      : invalidClass
                  } rounded-md`}
                />

                <p
                  className={`mt-1 text-sm ${
                    emailIsValid
                      ? "text-green-600"
                      : deatails.email
                      ? "text-red-600"
                      : "text-muted"
                  }`}
                >
                  {emailIsValid
                    ? ""
                    : deatails.email
                    ? "Please enter a valid email."
                    : "Enter your email address."}
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {loading ? (
                <div className="w-full px-4 py-3 rounded-md text-white text-sm font-medium focus:ring-2 bg-primary flex justify-center">
                  <Loader />
                </div>
              ) : (
              <button
                type="submit"
                disabled={!canContinue}
                className={`w-full px-4 py-3 rounded-md text-white text-sm font-medium focus:ring-2
                  ${
                    canContinue
                      ? "bg-primary hover:brightness-95"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Continue
              </button>
              )}
            </form>

            <p className="mt-4 text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link
                to="/seller/register"
                className="font-medium text-primary hover:text-accent"
              >
                Create one
              </Link>
            </p>
          </div>
        )}

        {/* verify otp */}
        {step === 2 && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text">
              Authentication
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              We've sent a 6-digit code to {deatails.email}
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength="6"
                placeholder="- - - - - -"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`${inputBase} ${neutralClass} text-center text-lg`}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}


              {loading ? (
                <div className="w-full px-4 py-3 rounded-md text-white text-sm font-medium focus:ring-2 bg-primary flex justify-center">
                  <Loader />
                </div>
              ) : (
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary text-white rounded-md text-sm font-medium hover:brightness-95"
              >
                Verify
              </button>
              )}
            </form>

            <p className="mt-4 text-center text-sm text-muted">
              Didn’t get a code?{" "}
              <button
                className="font-medium text-primary"
                onClick={handleDetailsSubmit}
                disabled={timer > 0}
              >
                {timer > 0 ? `Wait ${timer}s` : "resend OTP"}
              </button>
            </p>
            <p className="mt-4 text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link
                to="/seller/register"
                className="font-medium text-primary hover:text-accent"
              >
                Create one
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
