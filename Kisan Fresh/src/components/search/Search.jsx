import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

function Search() {
  const vegetables = useSelector((state) => state.vegetables.vegetables || []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  function handleSearch(name) {
    navigate(`/customer/search?query=${encodeURIComponent(name)}`);
    setQuery(name);
    setResults([]);
  }
  const location = useLocation();

  useEffect(() => {
    setQuery("");
    setResults([]);
  }, [location]);

  function handleSubmit(e) {
    e.preventDefault();
    handleSearch(query);
  }

  function findMatches(word) {
    if (!word.trim()) {
      setResults([]);
      return;
    }

    const regex = new RegExp(word, "i");

    // filter matching vegetables
    const found = vegetables.filter((veg) => regex.test(veg.name));

    // remove duplicates (by id)
    const unique = [...new Map(found.map((item) => [item.name, item])).values()];

    setResults(unique);
  }

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);
    findMatches(value);
  }
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md md:min-w-lg mx-auto relative"
    >
      <div className="relative">
        <input
          type="search"
          className="block w-full p-3 ps-9 bg-neutral-secondary-medium border rounded-4xl outline-none focus:ring-transparent text-heading text-sm shadow-lg border-primary"
          placeholder="Search..."
          value={query}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />

        {query && isFocused && (
          <ul className="absolute z-50 w-full bg-white border rounded-md mt-1 shadow-lg">
            {results.length === 0 && (
              <li className="m-2 text-gray-500">No match found</li>
            )}
            {results.map((item) => (
              <li
                key={item.id}
                onMouseDown={() => handleSearch(item.name)}
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
