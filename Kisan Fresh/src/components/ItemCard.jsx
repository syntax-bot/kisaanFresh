import React, { useState } from "react";
import PlusSvg from "../assets/PlusSvg";
import MinusSvg from "../assets/MinusSvg";
import CartSvg from "../assets/CartSvg";
import RatingStars from "../assets/RatingStars";
function ItemCard({ image, name, oldPrice, newPrice, rating }) {
  const [itemNum, setItemNum] = useState(0);
  var arr = [0 ,1, 2, 3, 4];
  const [discount, setDiscount] = useState(
    () => ((oldPrice - newPrice) / oldPrice) * 100
  );

  return (
    <>
      <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md select-none">
        <a className="relative mx-3 mt-3 flex h-60  rounded-xl" href="#">
          <img
            className="object-fit overflow-hidden rounded-xl"
            src={image}
            alt={name}
          />
          <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
            {discount}% OFF
          </span>
        </a>
        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl tracking-tight text-slate-900">{name}</h5>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-slate-900">₹{newPrice}</span>
              <span className="text-sm text-slate-900 line-through">
                {" "}
                ₹{oldPrice}
              </span>
            </p>
            <div className="flex items-center">
              {arr.map((ele) => {
                return (
                  <div key={ele} >
                    <RatingStars star={rating - ele} />
                  </div>
                );
              })}

              <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                {rating}
              </span>
            </div>
          </div>
          {itemNum == 0 ? (
            <div
              onClick={() => {
                setItemNum((prev) => prev + 1);
              }}
              className="rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white  hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <div className="flex items-center justify-center ">
                <CartSvg />
                Add to cart
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-around items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white">
                <div
                  className="minus"
                  onClick={() => {
                    setItemNum((prev) => (prev < 0 ? 0 : prev - 1));
                  }}
                >
                  <MinusSvg />
                </div>

                <div className="count text-sm select-none">{itemNum}</div>
                <div
                  className="plus min-h-full   focus:outline-none"
                  onClick={() => {
                    setItemNum((prev) => prev + 1);
                  }}
                >
                  <PlusSvg />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ItemCard;
