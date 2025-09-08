import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import PaymentForm from "./PaymentForm";

// 🔑 load Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No order data found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Complete Payment
      </h2>
      <Elements stripe={stripePromise}>
        <PaymentForm order={order} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
