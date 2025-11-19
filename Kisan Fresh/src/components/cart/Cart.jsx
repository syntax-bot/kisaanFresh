import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  decreaseQuantityby1,
} from "../../feature/cartSlice";
import AddToCartBtn from "../misc/AddToCartBtn";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalAmount = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const handleAddToCart = (item) => {
    console.log(item);
    const { id, name, oldPrice, price, rating, image } = item;
    dispatch(addToCart({ id, name, oldPrice, price, rating, image }));
  };

  const handleDecreaseFromCart = () => {
    dispatch(decreaseQuantityby1(id));
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
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.id}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">
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

            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
              BUY
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
