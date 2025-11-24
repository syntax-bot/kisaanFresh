import React, { useState } from "react";
import axios from "axios";
function Add_bidding_veggies() {
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    price: "",
    unit: "kg",
    stock: "",
    description: "",
    is_available: true,
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle File Upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) data.append("image", image);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/bidding/adding_veg/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, 
        }
      );
      setMessage(` ${res.data.message}`);
    } catch (err) {
      setMessage(` ${err.response?.data?.error || "Something went wrong"}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Add  Bidding Vegetable
      </h2>

      {message && (
        <p className="text-center mb-4 font-semibold text-blue-600">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Vegetable Name *"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Variety */}
        <input
          type="text"
          name="variety"
          placeholder="Variety (e.g. Red, Hybrid)"
          value={formData.variety}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder=" Min Bidding Price (₹)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        
        {/* Unit */}
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="kg">Kg</option>
          <option value="piece">Piece</option>
          <option value="quintal">Quintal</option>
          <option value="count">Piece</option>
        </select>

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
        >
          Add Vegetable
        </button>
      </form>
    </div>
  );
}

export default Add_bidding_veggies;
