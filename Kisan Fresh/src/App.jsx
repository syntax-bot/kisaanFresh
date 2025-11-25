import { useEffect, useState } from "react";
import ItemCard from "./components/ItemCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./components/misc/Loader";
import { useDispatch } from "react-redux";
import { add_veges_from_server } from "./feature/vegetableSlice";
// FilterBar component moved outside App for better performance
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

      <div>
        <label className="text-sm font-medium text-gray-700">Variety</label>
        <select
          name="variety"
          value={filters.variety}
          onChange={handleChange}
          className="ml-2 px-3 py-2 border rounded-md bg-white text-sm"
        >
          <option value="">All</option>
          <option value="organic">Organic</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="text-sm font-medium text-gray-700">Price</label>
        <select
          name="price"
          value={filters.price}
          onChange={handleChange}
          className="ml-2 px-3 py-2 border rounded-md bg-white text-sm"
        >
          <option value="">Any</option>
          <option value="0-50">₹0 - ₹50</option>
          <option value="50-100">₹50 - ₹100</option>
          <option value="100-200">₹100 - ₹200</option>
          <option value="200-1000000">₹200+</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-medium text-gray-700">Sort</label>
        <select
          name="sort"
          value={filters.sort}
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

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/buyer/vegetables/nearby/",
          { withCredentials: true }
        );

        if (res.data.error) return;
        console.log(res.data);
        setItems(res.data.vegetables);
        setFilteredItems(res.data.vegetables);
        dispatch(add_veges_from_server(res.data.vegetables));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  function applyFilter(filters) {
    let result = [...items];

    // Variety filter (case-insensitive)
    if (filters.variety) {
      result = result.filter(
        (item) => item.variety?.toLowerCase() === filters.variety.toLowerCase()
      );
    }

    // Price filter (improved with parseFloat and safety checks)
    if (filters.price) {
      const [minStr, maxStr] = filters.price.split("-");
      const min = parseFloat(minStr) || 0;
      const max = parseFloat(maxStr) || Infinity;
      result = result.filter((item) => {
        const itemPrice = parseFloat(item.price);
        return !isNaN(itemPrice) && itemPrice >= min && itemPrice <= max;
      });
    }

    // Sorting (improved to handle string prices)
    if (filters.sort === "low") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filters.sort === "high") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredItems(result);
  }

  return (
    <>
      <FilterBar onFilterChange={applyFilter} />

      <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {filteredItems.map((item) => (
          item.stock != 0 &&
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
        ))}
      </div>
    </>
  );
}

export default App;