import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const EditVegetable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const veg = location.state?.veg || {};

  const [formData, setFormData] = useState({
    name: veg.name || "",
    variety: veg.variety || "",
    price: veg.price || "",
    unit: veg.unit || "kg",
    stock: veg.stock || "",
    description: veg.description || "",
    freshness_level: "Fresh",
    is_available: true,
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing vegetable
  const fetchVeg = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/seller/my_vegetables/",
        { withCredentials: true } 
      );

      const veg = res.data.vegetables.find((v) => v.id === parseInt(id));
      if (!veg) {
        toast.error("Vegetable not found!");
        navigate("/seller/my_vegetables");
        return;
      }

      setFormData(veg);
    } catch (err) {
      toast.error("Failed to load vegetable");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVeg();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/seller/edit_vegetable/${id}/`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Vegetable updated!");
      navigate("/seller/my_vegetables");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed. Try again!");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-lg font-semibold">Loading...</div>
    );

  return (
    <div className="max-w-lg mx-auto my-12 bg-white shadow-lg p-6 rounded-lg border">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
        Edit Vegetable
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name *"
          className="w-full p-2 border rounded"
          required
        />

      

         {/* Variety */}
        <select
          name="variety"
          placeholder="Variety (e.g. Organic, Local)"
          value={formData.variety}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Variety</option>
          <option value="Organic">Organic</option>
          <option value="Hybrid">Hybrid</option>
        </select>


        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        ></textarea>

        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="kg">Kg</option>
          <option value="piece">Piece</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditVegetable;
