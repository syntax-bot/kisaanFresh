import React from "react";
import CartSvg from "../../assets/CartSvg";
import MinusSvg from "../../assets/MinusSvg";
import PlusSvg from "../../assets/PlusSvg";
function AddToCartBtn({ itemNum ,handleAddToCart , handleDecreaseFromCart}) {
  return (
    <>
      {itemNum === 0 ? (
        <div
          onClick={() => handleAddToCart()}
          className="rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-surface hover:bg-accent focus:outline-none focus:ring-4 focus:ring-secondary"
        >
          <div className="flex items-center justify-center">
            <CartSvg />
            Add to cart
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex w-full justify-between items-center rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-surface"
        >
          <button
            type="button"
            className="minus"
            onClick={() => handleDecreaseFromCart()}
          >
            <MinusSvg />
          </button>

          <div className="count text-sm select-none">{itemNum}</div>

          <button
            type="button"
            className="plus "
            onClick={() => handleAddToCart()}
          >
            <PlusSvg />
          </button>
        </button>
      )}
    </>
  );
}

export default AddToCartBtn;
