import React, { useState } from "react";
import PlusSvg from "../assets/PlusSvg";
import MinusSvg from "../assets/MinusSvg";
import CartSvg from "../assets/CartSvg";
import RatingStars from "../assets/RatingStars";
import AddToCartBtn from "./misc/AddToCartBtn";
import Rating from "./misc/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectItemQuantity,
  decreaseQuantityby1,
} from "../feature/cartSlice.js";

function ItemCard(item) {
  const dispatch = useDispatch();
  const { id, name, oldPrice, price, rating, image } = item;
  

  const itemNum = useSelector((state) => selectItemQuantity(state, id)) || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, oldPrice, price, rating, image }));
  };

  const handleDecreaseFromCart = () => {
    dispatch(decreaseQuantityby1(id));
  };
  const discount = ((oldPrice - price) / oldPrice) * 100;

  return (
    <>
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-surface shadow-md select-none">
        <Link
          className="relative mx-2 mt-2 flex h-50 sm:h-60 rounded-xl"
          to={`/item/${id}`}
          state={{
            id ,
            name,
            oldPrice,
            price,
            rating,
            image,
          }}
        >
          <img
            className="w-full h-full object-cover overflow-hidden rounded-xl"
            src={image}
            alt={name}
          />
          {discount > 0 && (
            <span className="absolute top-0 left-0 m-2 rounded-full bg-primary px-2 text-center text-sm font-medium text-surface">
              {discount}% OFF
            </span>
          )}
        </Link>

        <div className="mt-1 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-text">
            {name[0].toUpperCase() + name.slice(1)}
          </h5>

          <div className="flex items-center justify-between">
            <p>
              <span className="text-xl font-bold text-text">₹{price} </span>
              <span className="text-sm text-muted line-through">
                ₹{oldPrice}
              </span>
            </p>
          </div>

          <Rating rating={rating} />

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
