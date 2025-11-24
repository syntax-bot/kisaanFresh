import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/buyer/vegetables/nearby/",
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log(error)
        return ;
      }
      if (res.data.error) {
        // navigate("/customer/profile");
      }
      setItems(res.data.vegetables);
      console.log(res.data.vegetables);
    })();
  }, []);

  return (
    <>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            oldPrice={item.old_price}
            price={item.price}
            rating={item.rating}
            description={item.description}
            image={"http://127.0.0.1:8000/media/" + item.image}
          />
        ))}
      </div>
    </>
  );
}

export default App;