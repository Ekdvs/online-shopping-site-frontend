import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p>Your order ID: {orderData?.id}</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Home
      </button>
    </div>
  );
};

export default OrderSuccess;
