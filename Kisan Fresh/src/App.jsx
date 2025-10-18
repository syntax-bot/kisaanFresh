import { useState } from "react";
import ItemCard from "./components/ItemCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ItemCard
        name="banana"
        oldPrice="50"
        newPrice="30"
        rating={4.2}
        image="https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg"
      />
    </>
  );
}

export default App;
