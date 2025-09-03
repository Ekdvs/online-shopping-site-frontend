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
      // 1️⃣ Fetch user's latest address
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

      // 2️⃣ Prepare order payload
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

      // 3️⃣ Optional: create order via API immediately
      // const { data } = await Axios.post("/api/order/create", orderPayload, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // toast.success(data.message);

      // 4️⃣ Navigate to checkout page
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
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default BuyNowButton;
