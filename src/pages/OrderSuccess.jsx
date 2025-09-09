import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get orderData from state passed via navigate
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData?._id) return;

    // Auto-redirect to order details after 4 seconds
    const timer = setTimeout(() => {
     navigate(`/ordershow/${orderData.orderId}`, { state: { orderData } });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, orderData]);

  if (!orderData?._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <p className="text-red-600 text-lg">Order data not found.</p>
        <button
          onClick={() => navigate("/orders")}
          className=" py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-400 active:scale-95 transition-all duration-200"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 space-y-4">
      {/* Success Icon */}
      <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-100 mb-4">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-600">Thank you for your purchase. Redirecting to your order details...</p>

      {/* Order Summary */}
      <div className="bg-gray-50 border rounded-lg px-6 py-4 shadow-sm w-full max-w-md">
        <p className="text-gray-700">
          <span className="font-semibold">Order ID:</span> {orderData.orderId || orderData._id}
        </p>
        <p className="text-gray-700 mt-1">
          <span className="font-semibold">Total Amount:</span> Rs. {orderData.totalAmt}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => navigate("/")}
          className=" py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(`/ordershow/${orderData._id}`, { state: { orderData } })}
          className=" py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-500 active:scale-95 transition-all duration-200"
        >
          View Order
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
