import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../ItemCard";

function SearchResults() {
  const vegetables = useSelector((state) => state.vegetables.vegetables) || [];
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  const filtered = useMemo(() => {
    return vegetables.filter((veg) =>
      veg?.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, vegetables]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Results for: <span className="text-primary">{query}</span>
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No vegetables found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              oldPrice={item.old_price}
              price={item.price}
              rating={item.rating || 5}
              description={item.description}
              image={"http://127.0.0.1:8000/media/" + item.image}
              seller_id={item.seller_id}
              stock={item.stock}
              unit={item.unit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
