import React, { use, useEffect } from "react";

import AddToCartBtn from "../misc/AddToCartBtn";
import ItemCard from "../ItemCard";
import Thumbnail from "./Thumbnail";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Rating from "../misc/Rating.jsx";
import {
  addToCart,
  selectItemQuantity,
  decreaseQuantityby1,
} from "../../feature/cartSlice.js";
import RatingStars from "../../assets/RatingStars.jsx";
function ItemPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [otherVeggies, setOtherVeggies] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const {
    id,
    name,
    oldPrice,
    price,
    image,
    seller_id,
    stock,
    unit,
    description,
  } = location.state || {};
  const itemNum = useSelector((state) => selectItemQuantity(state, id)) || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, oldPrice, price }));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/buyer/seller_other_veg/?id=${seller_id}`,
          { withCredentials: true }
        );
        console.log(res.data);
        if (res.data.vegetables) {
          setOtherVeggies(res.data.vegetables);
        }

        const resrev = await axios.get(
          `http://127.0.0.1:8000/buyer/reviews/${id}/`,
          { withCredentials: true }
        );
        console.log(resrev.data.data);
        if (resrev.data.data) {
          setReviews(resrev.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [seller_id]);

  const handleDecreaseFromCart = () => {
    console.log(description);
    dispatch(decreaseQuantityby1(id));
  };

  return (
    <>
      <main class="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section class="lg:col-span-7 bg-white rounded shadow p-4">
          <div class="relative w-full h-[350px] bg-gray-50 rounded-xl overflow-hidden">
            <img
              src={image}
              alt="Product"
              class="w-full h-full object-cover object-center"
            />
            <span className="absolute bottom-0 right-0 m-2 rounded-full bg-secondary px-2 text-center text-sm font-medium text-surface">
              share
            </span>
          </div>

          <hr class="my-6" />

          <div>
            <h3 class="text-lg font-semibold">Product details</h3>
            <p class="mt-2 text-sm text-gray-700 line-clamp-3">{description}</p>
          </div>

          <hr class="my-6" />
        </section>

        <aside class="lg:col-span-5">
          <div class="sticky top-6 space-y-4">
            <div class="bg-white rounded shadow p-5">
              <h1 class="text-2xl font-semibold mt-2">{name}</h1>
              <div class="mt-2 flex items-center gap-4">
                <div class="text-3xl font-extrabold">₹{price}</div>
              </div>

              <label class="mt-4 block text-sm font-medium">
                Unit - {unit}
              </label>

              <div class="mt-5 ">
                <AddToCartBtn
                  itemNum={itemNum}
                  handleAddToCart={handleAddToCart}
                  handleDecreaseFromCart={handleDecreaseFromCart}
                />
              </div>
            </div>
          </div>
        </aside>

        <section class="lg:col-span-12 bg-white rounded shadow p-4">
          <h3 class="font-semibold">Other Vegetables from this Seller</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {otherVeggies.map(
              (item) =>
                item.stock != 0 && (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    image={"http://127.0.0.1:8000/media/" + item.image}
                    seller_id={item.seller_id}
                    stock={item.stock}
                    unit={item.unit}
                  />
                )
            )}
          </div>
          <hr class="my-6" />
          <div>
            <h4 class="font-semibold">Customer reviews</h4>
            <div class="mt-2 flex items-center gap-3">
              <div class="flex items-center gap-1"></div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="mt-4 space-y-3">
                {reviews.length === 0 && (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                )}

                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          
                          

                          <Rating rating={rev.rating} />
                        </div>

                        <div className="text-xs text-gray-500">
                          by {rev.buyer} — {rev.created_at}
                        </div>

                        <p className="mt-2 text-sm">{rev.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ItemPage;
