import React, { useState } from "react";
import PlusSvg from "../assets/PlusSvg";
import MinusSvg from "../assets/MinusSvg";
import CartSvg from "../assets/CartSvg";
import RatingStars from "../assets/RatingStars";

function ItemCard({ image, name, oldPrice, newPrice, rating }) {
  const [itemNum, setItemNum] = useState(0);
  var arr = [0, 1, 2, 3, 4];
  const discount = ((oldPrice - newPrice) / oldPrice) * 100;

  return (
    <>
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg bg-surface shadow-md select-none">
        <a className=" relative mx-3 mt-3 flex h-60 rounded-xl" href="#">
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
        </a>

        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-text">{name}</h5>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-2xl font-bold text-text">₹{newPrice}</span>
              <span className="text-sm text-muted line-through">
                {" "}
                ₹{oldPrice}
              </span>
            </p>

            <div className="flex items-center">
              <div className="hidden lg:flex items-center">
                {arr.map((ele) => (
                  <div key={ele}>
                    <RatingStars star={rating - ele} />
                  </div>
                ))}
              </div>

              <span className="ml-2 lg:ml-3 rounded bg-secondary px-2.5 py-0.5 text-xs font-semibold text-text">
                {Number(rating).toFixed(1)}
              </span>
            </div>
          </div>

          {itemNum === 0 ? (
            <div
              onClick={() => setItemNum((prev) => prev + 1)}
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
              className="flex w-full justify-around items-center rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-surface"
            >
              <button
                type="button"
                className="minus"
                onClick={() => setItemNum((prev) => Math.max(0, prev - 1))}
              >
                <MinusSvg />
              </button>

              <div className="count text-sm select-none">{itemNum}</div>

              <button
                type="button"
                className="plus min-h-full focus:outline-none"
                onClick={() => setItemNum((prev) => prev + 1)}
              >
                <PlusSvg />
              </button>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ItemCard;
