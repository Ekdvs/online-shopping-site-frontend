import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { CreditCardIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ order, setOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Create payment intent when order is ready
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!order?._id || !order?.totalAmt || !token) return;

      try {
        const res = await Axios.post(
          SummaryApi.createPaymentIntent.url,
          {
            orderId: order._id,
            amount: Math.round(order.totalAmt * 100),
            email: order?.userEmail || "",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success && res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setPaymentIntentId(res.data.paymentIntentId);
          console.log("Payment Intent created:", res.data);
        } else {
          toast.error(res.data?.message || "Failed to initialize payment");
        }
      } catch (err) {
        console.error("Payment intent error:", err);
        toast.error("Error initializing payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, [order, token]);

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: order?.userEmail || "",
            name: order?.userName || "Customer",
          },
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setLoading(false);
        return;
      }
      //console.log("paymentIntent:", paymentIntent);

     if (paymentIntent?.status === "succeeded") {
  try {
    const res = await Axios.put(
      SummaryApi.updateOrder.url(order._id), // pass order._id here
      { delivery_status: "pending", payment_status: "completed", payment_id: paymentIntent.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Order update response:", res.data);
    toast.success("Payment successful 🎉");

    setTimeout(() => navigate(`/ordersuccess`, { state: { orderData: res.data.data } } ), 1500);

  } catch (err) {
    console.error("Update order error:", err.response?.data || err.message);
    toast.error("Failed to update order status. Please contact support.");
  }
}

 else {
        toast.error(`Payment status: ${paymentIntent?.status}`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret && token && order?._id) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Initializing payment...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <ExclamationCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4 text-lg">Failed to initialize payment</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="flex items-center mb-4">
        <CreditCardIcon className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">Card Information</h2>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e", iconColor: "#e53e3e" },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Order Total:</strong> Rs. {order.totalAmt}
        </p>
        {paymentIntentId && (
          <p className="text-xs text-gray-500 mt-1">Payment ID: {paymentIntentId}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={`w-full flex justify-center items-center py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
          !stripe || loading || !clientSecret
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-400 to-purple-700 text-white hover:from-purple-700 hover:to-purple-400 active:scale-95"
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          `Pay Rs. ${order.totalAmt}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Your payment information is secure and encrypted
      </p>

      <div className="text-center text-gray-400 text-sm">
        <CheckCircleIcon className="inline w-4 h-4 mr-1" /> Powered by Stripe
      </div>
    </form>
  );
};

export default PaymentForm;
