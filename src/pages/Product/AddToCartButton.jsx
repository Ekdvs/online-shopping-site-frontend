import React, { useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AddToCartButton = ({ productId, quantity = 1 }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleAddToCart = async () => {
    if (!token) return toast.error("Login first to add to cart");
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.createCartItem.method,
        url: SummaryApi.createCartItem.url,
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, quantity },
      });
      if (data.success) toast.success(data.message || "Added to cart");
      else toast.error(data.message|| "Failed to add to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
