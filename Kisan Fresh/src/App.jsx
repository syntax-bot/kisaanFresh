import { useState } from "react";
import ItemCard from "./components/ItemCard";
import { useDispatch } from "react-redux";



function App() {
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <ItemCard
          id="1"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="2"
          name="banana"
          oldPrice="500"
          price="3000"
          rating={5}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id={3}
          name="banana"
          oldPrice="50"
          price="30"
          rating={3.5}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="4"
          name="banana"
          oldPrice="50"
          price="30"
          rating={2.4}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="5"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="6"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="7"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="8"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="9"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="10"
          name="banana"
          oldPrice="500"
          price="3000"
          rating={5}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="11"
          name="banana"
          oldPrice="50"
          price="30"
          rating={3.5}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="12"
          name="banana"
          oldPrice="50"
          price="30"
          rating={2.4}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="13"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="14"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="15"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
        <ItemCard
          id="16"
          name="banana"
          oldPrice="50"
          price="30"
          rating={4.2}
          image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
        />
      </div>
    </>
  );
}

export default App;
