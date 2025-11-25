import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  decreaseQuantityby1,
  clearCart,
} from "../../feature/cartSlice";
import AddToCartBtn from "../misc/AddToCartBtn";
import axios from "axios";
import { useNavigate } from "react-router";
import Loader from "../misc/Loader.jsx";
import { toast } from "react-toastify";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalAmount = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [loading, setLoading] = React.useState(false);
  const handleAddToCart = (item) => {
    console.log(item);
    const { id, name, oldPrice, price, rating, image } = item;
    dispatch(addToCart({ id, name, oldPrice, price, rating, image }));
  };

  const handleBuy = async () => {
    setLoading(true);
    console.log(cart);
    const cartData = cart.map((item) => {
      return { ...item, vegetable_id: item.id };
    });
    try {
      const res = await axios.post(
      "http://127.0.0.1:8000/buyer/vegetables/buy/",
      { cart: cartData },
      {
        withCredentials: true,
      }
    );
    } catch (error) {
      toast.error("Error processing purchase. Please try again.");
      setLoading(false);
      
      return;
    }
    
    setLoading(false);
    dispatch(clearCart())
    navigate("/customer/pending_purchases");
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="min-h-full text-center py-20 text-gray-500 dark:text-gray-300">
          Your cart is empty!
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h2 className="text-lg p-2 font-semibold text-gray-800 dark:text-white">
                    {item.name}
                  </h2>
                  <p className="text-gray-500 pb-2 dark:text-gray-300 text-sm">
                    ₹{item.price}
                  </p>

                  <AddToCartBtn
                    itemNum={item.quantity}
                    handleAddToCart={() => {
                      console.log(item);
                      handleAddToCart(item);
                    }}
                    handleDecreaseFromCart={() =>
                      dispatch(decreaseQuantityby1(item.id))
                    }
                  />

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-sm text-red-500 mt-3 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary */}
          <div className="flex flex-col  justify-between lg:w-80 min-h-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="pb-10">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Total Items:</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="flex justify-between mt-2 text-lg font-bold text-gray-800 dark:text-white">
                <span>Total Price:</span>
                <span>₹{totalAmount}</span>
              </div>

              <button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                command="show-modal"
                commandfor="dialog"
                // onClick={handleBuy}
              >
                BUY
              </button>

              <el-dialog>
                <dialog
                  id="dialog"
                  aria-labelledby="dialog-title"
                  class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
                >
                  <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                  <div
                    tabindex="0"
                    class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
                  >
                    <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3
                              id="dialog-title"
                              class=" text-lg font-bold text-primary  "
                            >
                              Confirm Purchase
                            </h3>
                            <div class="mt-2">
                              <p class="text-md text-gray-500">
                                Are you sure you want to buy these items? You
                                have to pay ₹{totalAmount} at the time of
                                delivery.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          // command="close"
                          commandfor="dialog"
                          class="inline-flex w-full justify-center min-w-[100px] rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary sm:ml-3 sm:w-auto"
                          onClick={handleBuy}
                        >
                          {loading ? (
                            <Loader width={20} height={20} />
                          ) : (
                            "Confirm"
                          )}
                        </button>
                        <button
                          type="button"
                          command="close"
                          commandfor="dialog"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          {loading ? (
                            <Loader width={20} height={20} />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      </div>
                    </el-dialog-panel>
                  </div>
                </dialog>
              </el-dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
