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
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const token = localStorage.getItem("token");

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!order?._id || !order?.totalAmt || !token) {
        console.error("Missing required data:", { order, token });
        return;
      }

      try {
        const requestData = {
          orderId: order._id,
          amount: Math.round(order.totalAmt * 100), // cents
        };

        const res = await Axios.post(
          SummaryApi.createPaymentIntent.url,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data?.success && res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setPaymentIntentId(res.data.paymentIntentId);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded yet");
      return;
    }
    if (!clientSecret) {
      toast.error("Payment not ready. Please refresh.");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        toast.error("Card details missing");
        setLoading(false);
        return;
      }

      // confirm payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // Hide postal code field, no incomplete_zip error
              address: { postal_code: "" },
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("Payment successful:", paymentIntent.id);

        try {
          await Axios.put(
            `${SummaryApi.updateOrder.url}/${order._id}`,
            {
              payment_status: "paid",
              payment_id: paymentIntent.id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Payment successful 🎉");
          setTimeout(() => (window.location.href = "/orders"), 1500);
        } catch (updateError) {
          console.error("Order update error:", updateError);
          toast.error(
            "Payment succeeded but order update failed. Please contact support."
          );
        }
      } else {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to initialize payment</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
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
              hidePostalCode: true, // ✅ FIXED
            }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Order Total:</strong> Rs. {order.totalAmt}
        </p>
        {paymentIntentId && (
          <p className="text-xs text-gray-500 mt-1">
            Payment ID: {paymentIntentId}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
          !stripe || loading || !clientSecret
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-700 hover:to-purple-500 active:scale-95"
        }`}
      >
        {loading ? "Processing..." : `Pay Rs. ${order.totalAmt}`}
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
};

export default PaymentForm;
