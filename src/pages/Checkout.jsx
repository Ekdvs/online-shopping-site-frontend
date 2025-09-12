import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import UserAddress from "./Product/UserAddress";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to proceed");
    navigate("/login");
    return null;
  }

  if (!orderData) {
    return (
      <div className="text-center py-20">
        <p className="mb-3 text-gray-500">No order data found.</p>
        <button
          onClick={() => navigate("/cart")}
          className="text-blue-600 font-medium hover:text-blue-800 transition"
        >
          Go to Cart
        </button>
      </div>
    );
  }

  const { items, deliveryFee } = orderData;
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Calculate totals
  const itemsTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const grandTotal = useMemo(() => itemsTotal + deliveryFee - discount, [itemsTotal, deliveryFee, discount]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("Enter a coupon code");
    setLoadingCoupon(true);
    try {
      const res = await Axios.post(
        SummaryApi.applyCoupon.url,
        { couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        toast.success(`Coupon applied! You saved Rs. ${res.data.discountAmount}`);
      } else {
        toast.error(res.data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying coupon");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Clear cart after order
  const clearCart = async () => {
    try {
      const res = await Axios.delete(SummaryApi.clearCart.url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) console.log("Cart cleared successfully");
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  // Proceed to payment
  const handleProceedToPay = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    setCreatingOrder(true);

    const orderPayload = {
      product_details: items,
      delivery_address: selectedAddress._id,
      subTotalAmt: itemsTotal,
      totalAmt: grandTotal,
      payment_status: "pending",
      payment_id: `COD-${Date.now()}`, // Temporary, updated after Stripe payment
    };

    try {
      const res = await Axios.post(SummaryApi.createOrder.url, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order created successfully!");
        await clearCart();
        navigate("/payment", { state: { order: res.data.data } });
      } else {
        toast.error(res.data.message || "Failed to create order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Address Selection */}
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <UserAddress onSelect={setSelectedAddress} />
        {!selectedAddress && <p className="mt-2 text-red-500 text-sm">Please select a delivery address to proceed.</p>}
      </div>

      {/* Order Items */}
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <h2 className="font-bold text-lg mb-3 text-gray-800">Order Items</h2>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center my-3 border-b pb-2 last:border-b-0">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium text-gray-800">Rs. {item.price}</p>
          </div>
        ))}
      </div>

      {/* Order Summary & Coupon */}
      <div className="border p-4 rounded-lg shadow-sm space-y-3 bg-white">
        <h2 className="font-bold text-lg mb-3 text-gray-800">Order Summary</h2>
        <div className="flex justify-between text-gray-700"><span>Items Total</span><span>Rs. {itemsTotal}</span></div>
        <div className="flex justify-between text-gray-700"><span>Delivery Fee</span><span>Rs. {deliveryFee}</span></div>
        {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>- Rs. {discount}</span></div>}
        <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2"><span>Grand Total</span><span>Rs. {grandTotal}</span></div>

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Enter coupon"
            className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loadingCoupon}
            className=" py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-400 active:scale-95 transition-all duration-200"
          >
            {loadingCoupon ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={handleProceedToPay}
          disabled={creatingOrder}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200"
        >
          {creatingOrder ? "Placing Order..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
