import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/buyer/vegetables/nearby/",
          { withCredentials: true }
        );

        if (res.data.error) return;

        setItems(res.data.vegetables);
        setFilteredItems(res.data.vegetables); 
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  function applyFilter(filters) {
    let result = [...items];

    if (filters.variety) {
      result = result.filter(item => item.variety === filters.variety);
    }

    if (filters.price) {
      const [min, max] = filters.price.split("-");
      result = result.filter(item => item.price >= min && item.price <= max);
    }

    if (filters.sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(result);
  }

  
  const FilterBar = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
      variety: "",
      price: "",
      sort: "",
    });

    function handleChange(e) {
      const { name, value } = e.target;
      const updated = { ...filters, [name]: value };
      setFilters(updated);
      onFilterChange(updated);
    }

    return (
      <div className="flex items-center justify-around gap-4 bg-gray-100 p-4 rounded-xl shadow-sm flex-wrap">
        {/* Variety */}
        <div>
          <label className="text-sm font-medium text-gray-700">Variety</label>
          <select
            name="variety"
            onChange={handleChange}
            className="ml-2 px-3 py-2 border rounded-md bg-white text-sm"
          >
            <option value="">All</option>
            <option value="local">Organic</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-gray-700">Price</label>
          <select
            name="price"
            onChange={handleChange}
            className="ml-2 px-3 py-2 border rounded-md bg-white text-sm"
          >
            <option value="">Any</option>
            <option value="0-50">₹0 - ₹50</option>
            <option value="50-100">₹50 - ₹100</option>
            <option value="100-200">₹100 - ₹200</option>
            <option value="200-1000000">200+</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium text-gray-700">Sort</label>
          <select
            name="sort"
            onChange={handleChange}
            className="ml-2 px-3 py-2 border rounded-md bg-white text-sm"
          >
            <option value="">None</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>
    );
  };

  
  return (
    <>
      <FilterBar onFilterChange={applyFilter} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {filteredItems.map(item => (
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
