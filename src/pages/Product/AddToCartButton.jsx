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
      className="py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
