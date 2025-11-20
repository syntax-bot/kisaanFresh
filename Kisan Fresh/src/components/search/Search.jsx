import React, { useState } from "react";
import { useNavigate } from "react-router";

function Search() {
  const vegetables = [
    { name: "Tomato" },
    { name: "Potato" },
    { name: "Carrot" },
    { name: "Spinach" },
    { name: "Onion" },
    { name: "Cabbage" },
    { name: "Cauliflower" },
    { name: "Coriander" },
    { name: "Garlic" },
    { name: "Ginger" },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    const value = e.target.value;
    
    navigate(`/search?query=${value}`);
  }
  
  function findMatches(word) {
    if (!word.trim()) {
      setResults([]);
      return;
    }

    const regex = new RegExp(word, "gi");
    const found = vegetables.filter((veg) => regex.test(veg.name));

    setResults(found);
  }

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);
    findMatches(value);
  }

  return (
    <form className="max-w-md md:min-w-lg mx-auto relative">
      <div className="relative">
        <input
          type="search"
          className="block w-full p-3 ps-9 bg-neutral-secondary-medium border rounded-4xl outline-none focus:ring-transparent text-heading text-sm shadow-lg  border-primary"
          placeholder="Search "
          value={query}
          onChange={handleInput}
        />

        {query && (
          <ul className="absolute z-50 w-full bg-white border rounded-md mt-1 min-h-full   shadow-lg">
            {results.length === 0 && (
              <li className="m-2 text-gray-500">No match found</li>
            )}
            {results.map((item, idx) => (
              <li
                key={idx}
                className="p-2 text-lg hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default Search;
