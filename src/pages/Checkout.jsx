import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {}; // Get order data from navigate

  if (!orderData) {
    return (
      <div className="text-center py-20">
        No order data found.{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  const { items, deliveryFee, total, shippingAddress, deliveryOption } = orderData;
  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const grandTotal = itemsTotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Shipping & Billing */}
      <div className="border p-4 rounded relative">
        <h2 className="font-bold text-lg mb-2">Shipping & Billing</h2>
        <p>{shippingAddress.name} - {shippingAddress.mobile}</p>
        <p>
          {shippingAddress.address_line}, {shippingAddress.city}, {shippingAddress.state},{" "}
          {shippingAddress.pincode}, {shippingAddress.country}
        </p>
        <p>Delivery Option: {deliveryOption?.name || "Standard"} - Rs. {deliveryFee}</p>
        {deliveryOption?.estimatedDate && (
          <p className="text-gray-500 text-sm">
            Guaranteed by {deliveryOption.estimatedDate}
          </p>
        )}
        <button
          className="absolute top-2 right-2 text-blue-500 text-sm"
          onClick={() => alert("Edit shipping info")}
        >
          Edit
        </button>
      </div>

      {/* Items */}
      <div className="border p-4 rounded">
        <h2 className="font-bold text-lg mb-2">Order Items</h2>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between my-3 border-b pb-2 last:border-b-0">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded"/>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.brand || "No Brand"}</p>
                <p>Qty: {item.quantity}</p>
                {item.originalPrice && item.price !== item.originalPrice && (
                  <div className="flex items-center gap-2">
                    <p className="line-through text-gray-400 text-sm">Rs. {item.originalPrice}</p>
                    <p className="text-red-500 text-sm">
                      Rs. {item.price} ({item.discountPercent}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p>Rs. {item.price}</p>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border p-4 rounded">
        <h2 className="font-bold text-lg mb-2">Order Summary</h2>
        <div className="flex justify-between my-1">
          <span>Items Total:</span>
          <span>Rs. {itemsTotal}</span>
        </div>
        <div className="flex justify-between my-1">
          <span>Delivery Fee:</span>
          <span>Rs. {deliveryFee}</span>
        </div>
        <div className="flex justify-between my-1 font-bold text-orange-600 text-lg">
          <span>Total:</span>
          <span>Rs. {grandTotal}</span>
        </div>
        <button
          className="mt-4 w-full py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          onClick={() => navigate("/payment", { state: { orderData } })}
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;
