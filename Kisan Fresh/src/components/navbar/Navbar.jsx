import React, { useEffect } from "react";
import kisanFreshLogo from "../../assets/kisanfreshlogo-removebg.png";
import CartSvg from "../../assets/CartSvg";
import userImage from "../../assets/UserImage.jsx";
import UserImage from "../../assets/UserImage.jsx";
import { Link } from "react-router";
import Search from "../search/Search.jsx";


function Navbar() {
  const isUserLoggedIn = true; // This should be replaced with actual authentication logic
  useEffect(() => {
    console.log("User logged in status:", isUserLoggedIn);
  }, [isUserLoggedIn]);
  return (
    <nav>
      
      <div className="bg-surface p-2 sm:mx-5 flex  justify-between items-center">
        <Link to={`/`}>
          <div className="logo ">
            <img className="h-14" src={kisanFreshLogo} alt="Kisan Fresh Logo" />
          </div>
        </Link>

        <div className="">
          <Search />
        </div>
        <div className="user">
          {isUserLoggedIn ? (
            <div className="flex">
              <Link to={`/customer/cart`}>
                <button className="cart mx-1 text-primary px-2 py-1 rounded-3xl  ">
                  <CartSvg />
                </button>
              </Link>
              <Link to={`/customer/profile`}>
                <button class="profile mx-1 text-primary px-2 py-1 rounded-3xl  ">
                  <UserImage />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex">
              <button className="login text-primary px-3 py-1 rounded-3xl hover:text-white hover:bg-primary/75 ">
                Login
              </button>
              <button className="signup px-3 py-1 rounded-full text-white bg-primary hover:bg-accent ml-2">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
