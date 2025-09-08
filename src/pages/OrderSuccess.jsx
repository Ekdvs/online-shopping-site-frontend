import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  // Auto-redirect to /orders after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* Success Icon */}
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-600 mb-4">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {/* Order Details */}
      {orderData && (
        <div className="bg-gray-50 border rounded-lg px-6 py-4 shadow-sm mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Order ID:</span>{" "}
            {orderData._id || orderData.id}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-semibold">Total Amount:</span>{" "}
            Rs. {orderData.totalAmt}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition"
        >
          View My Orders
        </button>
      </div>

      {/* Auto-redirect text */}
      <p className="text-xs text-gray-500 mt-6">
        Redirecting you to your orders page...
      </p>
    </div>
  );
};

export default OrderSuccess;
