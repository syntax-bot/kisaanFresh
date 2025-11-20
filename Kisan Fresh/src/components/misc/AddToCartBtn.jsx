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
        <div
          
          className="flex w-full justify-between items-center rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-surface"
        >
          <div
            
            className="minus"
            onClick={() => handleDecreaseFromCart()}
          >
            <MinusSvg />
          </div>

          <div className="count text-sm select-none">{itemNum}</div>

          <div
            
            className="plus "
            onClick={() => handleAddToCart()}
          >
            <PlusSvg />
          </div>
        </div>
      )}
    </>
  );
}

export default AddToCartBtn;
