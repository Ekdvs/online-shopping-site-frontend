// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  CheckBadgeIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await Axios.get(`/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          toast.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error(error.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!order) return <p className="text-center mt-10 text-lg">Order not found.</p>;

  const products = JSON.parse(order.product_details);

  const paymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircleIcon className="w-5 h-5" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
            <ClockIcon className="w-5 h-5" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-1">
            <XCircleIcon className="w-5 h-5" /> Failed
          </span>
        );
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{status}</span>;
    }
  };

  const deliveryBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
            <ClockIcon className="w-5 h-5" /> Pending
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
            <TruckIcon className="w-5 h-5" /> Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckBadgeIcon className="w-5 h-5" /> Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-1">
            <XCircleIcon className="w-5 h-5" /> Cancelled
          </span>
        );
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{status}</span>;
    }
  };

  // Delivery Steps
  const deliverySteps = ["pending", "shipped", "delivered"];
  const currentStep = deliverySteps.indexOf(order.delivery_status.toLowerCase());

  const deliveryFee = 280;
  const totalAmount = order.totalAmt;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Navigation Buttons */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
        >
          ← Back to Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-1"
        >
          <HomeIcon className="w-5 h-5" /> 7Home
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Order Details</h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 col-span-2">
          {/* Order Info */}
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Order Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Payment Status:</strong> {paymentBadge(order.payment_status)}</p>
              <p><strong>Delivery Status:</strong> {deliveryBadge(order.delivery_status)}</p>
            </div>

            {/* Animated Delivery Progress */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Delivery Progress</h3>
              <div className="relative flex items-center justify-between">
                {/* Horizontal line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 rounded">
                  <div
                    className="h-1 bg-green-600 rounded transition-all duration-700 ease-in-out"
                    style={{ width: `${((currentStep + 1) / deliverySteps.length) * 100}%` }}
                  />
                </div>
                {/* Step Circles */}
                {deliverySteps.map((step, index) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${
                        index <= currentStep ? "bg-green-600" : "bg-gray-300"
                      } transition-colors duration-500`}
                    >
                      {index + 1}
                    </div>
                    <span className="mt-2 text-sm capitalize">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <p><strong>Name:</strong> {order.userId.name}</p>
            <p><strong>Email:</strong> {order.userId.email}</p>
          </div>

          {/* Delivery Address */}
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <p><strong>Name:</strong> {order.delivery_address.name}</p>
            <p>
              <strong>Address:</strong> {order.delivery_address.address_line}, {order.delivery_address.city}, {order.delivery_address.state}, {order.delivery_address.pincode}, {order.delivery_address.country}
            </p>
            <p><strong>Mobile:</strong> {order.delivery_address.mobile}</p>
          </div>

          {/* Products */}
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center border p-4 rounded-lg bg-gray-50 hover:shadow-md transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Price: Rs. {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Rs. {order.subTotalAmt}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>
          </div>
        </div>
        
      </div>
      {/* Navigation Buttons */}
      <div className="">
        
         <button
          onClick={() => navigate("/")}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          Home
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
