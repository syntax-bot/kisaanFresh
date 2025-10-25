import { useState } from "react";
import ItemCard from "./components/ItemCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          /><ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
          <ItemCard
            name="banana"
            oldPrice="50"
            newPrice="30"
            rating={4.2}
            image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
          />
        </div>

    </>
  );
}

export default App;
