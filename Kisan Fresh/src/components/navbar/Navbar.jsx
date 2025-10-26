import React, { useEffect } from "react";
import kisanFreshLogo from "../../assets/kisanfreshlogo-removebg.png";
import CartSvg from "../../assets/CartSvg";
function Navbar() {
  const isUserLoggedIn = true; // This should be replaced with actual authentication logic
  useEffect(() => {
    console.log("User logged in status:", isUserLoggedIn);

  }, [isUserLoggedIn]);
  return (
    <nav>
      <div className="bg-surface p-2 mx-3 sm:mx-5 flex  justify-between items-center">
        <div className="logo">
          <img className="h-14" src={kisanFreshLogo} alt="Kisan Fresh Logo" />
        </div>
        <div className="user">
          {isUserLoggedIn ? (
            <div className="flex">
              <button className="cart text-primary px-2 py-1 rounded-3xl  ">
                <CartSvg />
              </button>
              <button className="profile text-primary px-2 py-1 rounded-3xl  ">
                Profile
              </button>
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
