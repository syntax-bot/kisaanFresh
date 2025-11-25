import React, { use, useEffect } from "react";
import kisanFreshLogo from "../../assets/kisanfreshlogo-removebg.png";
import CartSvg from "../../assets/CartSvg";
import userImage from "../../assets/UserImage.jsx";
import UserImage from "../../assets/UserImage.jsx";
import { Link, useLocation } from "react-router";
import Search from "../search/Search.jsx";
import { useSelector } from "react-redux";

function Navbar() {
  const isUserLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.userInfo?.role);
  const location = useLocation();
  const showSearch = location.pathname === "/home" || location.pathname === "/customer/search";
  const path = userRole === "buyer" ? "/home" : "/seller/my_vegetables";
  return (
    <nav>
      <div className="bg-surface p-2 sm:mx-5 flex  justify-between items-center">
        <Link to={path}>
          <div className="logo ">
            <img className="h-14" src={kisanFreshLogo} alt="Kisan Fresh Logo" />
          </div>
        </Link>

        {isUserLoggedIn && userRole === "buyer" && showSearch && <Search />}

        <div className="user">
          {isUserLoggedIn ? (
            userRole === "buyer" ? (
              <div className="flex">
                <Link to={`/customer/cart`}>
                  <button className="cart mx-1 text-primary px-2 py-1 rounded-3xl  ">
                    <CartSvg />
                  </button>
                </Link>
                <Link to={`/customer/dashboard`}>
                  <button class="profile mx-1 text-primary px-2 py-1 rounded-3xl  ">
                    <UserImage />
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex">
                <Link to={`/seller/add_veggies`}>
                  <button className="cart mx-1 text-primary px-2 py-1 rounded-3xl  ">
                    <CartSvg />
                  </button>
                </Link>
                <Link to={`/seller/dashboard`}>
                  <button class="profile mx-1 text-primary px-2 py-1 rounded-3xl  ">
                    <UserImage />
                  </button>
                </Link>
              </div>
            )
          ) : (
            <div className="flex">
              <Link
                to={`customer/login`}
                className="login text-primary px-3 py-1 rounded-3xl hover:text-white hover:bg-primary/75 "
              >
                Login
              </Link>
              <Link
                to={`customer/register`}
                className="signup px-3 py-1 rounded-full text-white bg-primary hover:bg-accent ml-2"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
