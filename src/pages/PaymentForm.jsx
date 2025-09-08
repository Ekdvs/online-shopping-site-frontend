import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const PaymentForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const token = localStorage.getItem("token");

  // 🔹 Fetch clientSecret from backend when order is available
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await Axios.post(
          SummaryApi.createPaymentIntent.url,
          { amount: order.totalAmt * 100, orderId: order._id }, // amount in cents
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error(err);
        toast.error("Error creating payment intent");
      }
    };
    if (order?._id) createPaymentIntent();
  }, [order, token]);

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement },
      }
    );

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        // 🔹 Update order in backend
        await Axios.put(
          `${SummaryApi.updateOrder.url}/${order._id}`,
          { payment_status: "paid", payment_id: paymentIntent.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Payment successful 🎉");
        window.location.href = "/orders"; // redirect user
      } catch (err) {
        console.error(err);
        toast.error("Payment succeeded but order update failed");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        className="border p-3 rounded-lg"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:from-purple-700 hover:to-purple-500 active:scale-95 transition-all duration-200"
      >
        {loading ? "Processing..." : `Pay Rs. ${order.totalAmt}`}
      </button>
    </form>
  );
};

export default PaymentForm;
