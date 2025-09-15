import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const token = localStorage.getItem("token");

  if (!order) {
    toast.error("No order found for payment");
    navigate("/checkout");
    return null;
  }

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await Axios.post(
          SummaryApi.createPaymentIntent.url,
          { orderId: order._id, amount: order.totalAmt, email: order?.userEmail || "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setPaymentIntentId(res.data.paymentIntentId);
        } else {
          toast.error(res.data.message || "Failed to initialize payment");
        }
      } catch (err) {
        toast.error("Error initializing payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, [order, token]);

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

    if (paymentIntent?.status === "succeeded") {
      // Update order status
      await Axios.put(
        SummaryApi.updateOrder.url(order._id),
        {
          delivery_status: "pending",
          payment_status: "completed",
          payment_id: paymentIntent.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Poll backend until receipt_url is available
      let receipt = null;
      for (let i = 0; i < 10; i++) { // poll 10 times
        try {
          const res = await Axios.get(
            SummaryApi.getPaymentReceipt.url(paymentIntent.id),
            { headers: { Authorization: `Bearer ${token}` } }
          );
          receipt = res.data?.receipt_url;
          if (receipt) break;
        } catch (err) {
          console.error("Error fetching receipt:", err);
        }
        await new Promise((r) => setTimeout(r, 1000)); // wait 1s
      }

      if (receipt) {
        setReceiptUrl(receipt);
        toast.success("Payment successful 🎉");
      } else {
        toast.warning("Payment succeeded but receipt not available yet.");
      }

    } else {
      toast.error(`Payment status: ${paymentIntent?.status}`);
    }
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <ExclamationCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4 text-lg">Initializing payment...</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
      {!receiptUrl ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <CreditCardIcon className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">Card Information</h2>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#a0aec0" } },
                },
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
            {paymentIntentId && <p className="text-xs text-gray-500 mt-1">Payment ID: {paymentIntentId}</p>}
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
            {loading ? "Processing..." : `Pay Rs. ${order.totalAmt}`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Your payment information is secure and encrypted
          </p>
          <div className="text-center text-gray-400 text-sm">
            <CheckCircleIcon className="inline w-4 h-4 mr-1" /> Powered by Stripe
          </div>
        </form>
      ) : (
        <div className="text-center py-8 space-y-4">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-700">Payment Successful!</h2>
          {receiptUrl && (
            <p className="text-sm text-gray-600">
              <DocumentIcon className="inline w-4 h-4 mr-1" />
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Receipt
              </a>
            </p>
          )}
          <button
            onClick={() => navigate("/ordersuccess", { state: { orderData: order } })}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200"
        >
            Go to Order Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
