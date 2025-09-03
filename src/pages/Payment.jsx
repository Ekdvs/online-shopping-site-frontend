import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!orderData) return <p>No order data found!</p>;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Fake payment gateway call
      const paymentResponse = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, paymentId: "PAY123456" }), 1500)
      );

      if (paymentResponse.success) {
        // Update order in DB
        await axios.put(`http://localhost:8080/api/orders/${orderData.id}`, {
          paymentStatus: "Paid",
          paymentId: paymentResponse.paymentId,
        });

        navigate("/order-success", { state: { orderData } });
      } else {
        alert("Payment Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="font-bold text-xl mb-4">Payment</h2>
      <p>Total Amount: Rs. {orderData.total}</p>
      <button
        onClick={handlePayment}
        className="mt-4 w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
