import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";

const BuyNowButton = ({ product, quantity = 1 }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Get user info from localStorage (optional)
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "Guest";

  const handleBuyNow = async () => {
    if (!token) return toast.error("Login first to buy");

    setLoading(true);
    try {
      
      const addressRes = await Axios.get("/api/address/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const deliveryAddress = Array.isArray(addressRes.data.data)
        ? addressRes.data.data[addressRes.data.data.length - 1]
        : addressRes.data.data;

      if (!deliveryAddress || !deliveryAddress._id) {
        toast.error("Please add delivery address");
        setLoading(false);
        return;
      }

      
      const orderPayload = {
        orderId: `ORD-${Date.now()}`,
        product_details: [
          {
            productId: product._id,
            quantity,
            price: product.price,
            name: product.name,
            image: product.image[0],
          },
        ],
        payment_id: "COD-0001",
        payment_status: "pending",
        delivery_address: deliveryAddress._id, // Address ObjectId
        subTotalAmt: product.price * quantity,
        totalAmt: product.price * quantity + 280, // Add shipping fee
        invoice_receipt: null,
      };

     

      
      navigate("/checkout", {
        state: {
          orderData: {
            items: orderPayload.product_details,
            deliveryFee: 280,
            total: orderPayload.totalAmt,
            shippingAddress: { ...deliveryAddress, name: userName },
          },
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      className="py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      disabled={loading}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default BuyNowButton;
