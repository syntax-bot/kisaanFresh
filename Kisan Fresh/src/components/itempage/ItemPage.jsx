import React, { use } from "react";

import AddToCartBtn from "../misc/AddToCartBtn";
import ItemCard from "../ItemCard";
import Rating from "../misc/Rating";
import Thumbnail from "./Thumbnail";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  addToCart,
  selectItemQuantity,
  decreaseQuantityby1,
} from "../../feature/cartSlice.js";
function ItemPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id, name, oldPrice, price, rating, image } = location.state || {};
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
      <main class="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* <button
          className=""
          onClick={async () => {
            const data = {
              mobile: "1234567890",
              email: "testuser@example.com",
            };
            try {
              const res = await axios.post(
                "http://127.0.0.1:8000/register_buyer/",
                data
              );
              console.log("✅ Manga created successfully!", res.data);
            } catch (err) {
              console.error(err);
            }
          }}
        >
          click me
        </button> */}
        <section class="lg:col-span-7 bg-white rounded shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div class="hidden md:flex md:flex-col items-center mt-1 gap-2 col-span-1">
              <Thumbnail
                src="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
                alt="thumb2"
              />
              <Thumbnail
                src="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
                alt="thumb2"
              />
              <Thumbnail
                src="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
                alt="thumb2"
              />
            </div>

            <div class="col-span-4">
              <div class="relative aspect-w-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  id="mainImage"
                  src="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
                  alt="Product image"
                  class="object-contain max-h-120 md:max-h-120 w-auto"
                />
                <span className="absolute bottom-0 right-0 m-2 rounded-full bg-secondary px-2 text-center text-sm font-medium text-surface">
                  share
                </span>
              </div>
            </div>
          </div>

          <hr class="my-6" />

          <div>
            <h3 class="text-lg font-semibold">Product details</h3>
            <p class="mt-2 text-sm text-gray-700 line-clamp-3">
              This is a sample product description used to demonstrate a mock
              Amazon item page. It includes feature bullet points, meta
              information, and a longer description block to show how text wraps
              around the page. Replace this area with your real product copy.
            </p>

            <ul class="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>High performance and durable build</li>
              <li>Battery life: up to 20 hours</li>
              <li>Includes carrying case and USB-C cable</li>
              <li>1-year manufacturer warranty</li>
            </ul>
          </div>

          <hr class="my-6" />
        </section>

        <aside class="lg:col-span-5">
          <div class="sticky top-6 space-y-4">
            <div class="bg-white rounded shadow p-5">
              <h1 class="text-2xl font-semibold mt-2">{name}</h1>
              <div class="mt-2 flex items-center gap-4">
                <div class="text-3xl font-extrabold">₹{price}</div>
                <div class="text-sm line-through text-gray-500">
                  ₹{oldPrice}
                </div>
                <div class="text-sm text-green-600 font-medium">
                  {discount > 0 ? `${Math.round(discount)}% off` : ""}
                </div>
              </div>

              <div class="mt-3">
                <Rating rating={4.5} />
              </div>

              <label class="mt-4 block text-sm font-medium">
                Unit - {"1 kg"}
              </label>

              <div class="mt-5 grid grid-cols-2 gap-3">
                <AddToCartBtn
                  itemNum={itemNum}
                  handleAddToCart={handleAddToCart}
                  handleDecreaseFromCart={handleDecreaseFromCart}
                />
                <button
                  id="buyNow"
                  class="col-span-1 px-4 py-3 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section class="lg:col-span-12 bg-white rounded shadow p-4">
          <h3 class="font-semibold">Customers also bought</h3>
          <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ItemCard
              id={"1"}
              name="banana"
              oldPrice="50"
              price="30"
              rating={4}
              image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
            />
            <ItemCard
              id={"2"}
              name="banana"
              oldPrice="50"
              price="30"
              rating={4}
              image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
            />
            <ItemCard
              id={"3"}
              name="banana"
              oldPrice="50"
              price="300"
              rating={4.5}
              image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
            />
            <ItemCard
              id={"4"}
              name="banana"
              oldPrice="50"
              price="30"
              rating={4}
              image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
            />
          </div>
          <hr class="my-6" />
          <div>
            <h4 class="font-semibold">Customer reviews</h4>
            <div class="mt-2 flex items-center gap-3">
              <div class="flex items-center gap-1">
                {/* stars  */}
                <Rating rating={4.6} />
                <span class="text-sm text-gray-600">(1,234 ratings)</span>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">Great sound for the price</div>
                    <div class="text-xs text-gray-500">
                      by Priya — Nov 2, 2025
                    </div>
                    <p class="mt-2 text-sm">
                      I was surprised how balanced the audio is. Comfortable for
                      long use and the battery lasts.
                    </p>
                  </div>
                  <div class="text-sm text-gray-600">Verified Purchase</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ItemPage;
