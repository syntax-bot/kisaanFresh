import React, { useState } from "react";
import PlusSvg from "../assets/PlusSvg";
import MinusSvg from "../assets/MinusSvg";
import CartSvg from "../assets/CartSvg";
import AddToCartBtn from "./misc/AddToCartBtn";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectItemQuantity,
  decreaseQuantityby1,
} from "../feature/cartSlice.js";

function ItemCard(item) {
  const dispatch = useDispatch();
  const { id, name, price, image, seller_id, stock, unit, description } = item;

  const itemNum = useSelector((state) => selectItemQuantity(state, id)) || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, price, image }));
  };

  const handleDecreaseFromCart = () => {
    dispatch(decreaseQuantityby1(id));
    console.log(description);
  };

  return (
    <>
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-surface shadow-md select-none">
        <Link
          className="relative mx-2 mt-2 flex h-50 sm:h-60 rounded-xl"
          to={`/item/${id}`}
          state={{
            id,
            name,
            price,
            image,
            description,
            seller_id,
            stock,
            unit,
          }}
        >
          <img
            className="w-full h-full object-cover overflow-hidden rounded-xl"
            src={image}
            alt={name}
          />
        </Link>

        <div className="mt-1 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-text">
            {name[0].toUpperCase() + name.slice(1)}
          </h5>

          <div className="flex items-center justify-between">
            <p>
              <span className="text-xl mb-1 font-bold text-text">
                ₹{price}{" "}
              </span>
            </p>
          </div>
          <p className="text-sm py-1  text-text">Unit - {unit} </p>

          <AddToCartBtn
            itemNum={itemNum}
            handleAddToCart={handleAddToCart}
            handleDecreaseFromCart={handleDecreaseFromCart}
          />
        </div>
      </div>
    </>
  );
}

export default ItemCard;
