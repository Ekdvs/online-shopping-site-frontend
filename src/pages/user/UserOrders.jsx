// src/pages/UserOrders.jsx
import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Loader from "../../components/Loader";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const { data } = await Axios.get("/api/order/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const parsedOrders = data.data.map((order) => ({
          ...order,
          product_details: JSON.parse(order.product_details),
        }));
        setOrders(parsedOrders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your orders");
      return;
    }
    fetchOrders();
  }, [token]);

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
            <CheckCircleIcon className="w-4 h-4" /> {status}
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
            <ClockIcon className="w-4 h-4" /> {status}
          </span>
        );
      case "shipped":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
            <TruckIcon className="w-4 h-4" /> {status}
          </span>
        );
      case "failed":
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
            <XCircleIcon className="w-4 h-4" /> {status}
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">{status}</span>
        );
    }
  };

  if (loading) return <Loader />;
  if (orders.length === 0) return <p className="text-center py-10 text-lg">No orders found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate(`/ordershow/${order.orderId}`, { state: { orderData: order } })}
        >
          {/* Header: Order ID & Date */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700">Order ID: {order.orderId}</span>
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 mb-3">
            {statusBadge(order.payment_status)}
            {statusBadge(order.delivery_status)}
          </div>

          {/* Products */}
          <div className="flex gap-3 overflow-x-auto mb-3">
            {order.product_details.map((item) => (
              <img
                key={item.productId || item._id}
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
            <span>Total:</span>
            <span>Rs. {order.totalAmt}</span>
          </div>

          {/* Delivery Address */}
          {order.delivery_address ? (
            <div className="text-gray-600 text-sm mt-2">
              <p>Name: {order.delivery_address.name}</p>
              <p>Mobile: {order.delivery_address.mobile}</p>
              <p>
                Address: {order.delivery_address.address_line}, {order.delivery_address.city},{" "}
                {order.delivery_address.state} - {order.delivery_address.pincode}
              </p>
            </div>
          ) : (
            <div className="text-red-500 text-sm mt-2">Address not found</div>
          )}
        </div>
      ))}

      
    </div>
  );
};

export default UserOrders;
