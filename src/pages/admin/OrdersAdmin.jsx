// src/admin/OrdersAdmin.jsx
import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await Axios.get("/api/order/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setOrders(data.data);
      else toast.error(data.message || "Failed to fetch orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch single order by ID
  const fetchOrderById = async (id) => {
    try {
      const { data } = await Axios.get(`/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setSelectedOrder(data.data);
        console.log(selectedOrder);
      } else toast.error("Order not found");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch order");
    }
  };

  // Update order status
  const updateOrderStatus = async (statusType, value) => {
    if (!selectedOrder) return;
    try {
      const { data } = await Axios.put(
        `/api/order/update/${selectedOrder._id}`,
        { [statusType]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Order updated successfully");
        setSelectedOrder(data.data);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Badge helper
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

  // Delivery progress bar
  const deliveryProgress = (status) => {
    const stages = ["pending", "shipped", "delivered"];
    return (
      <div className="flex items-center gap-2 mb-4">
        {stages.map((stage, idx) => {
          const completed = stages.indexOf(status) >= idx;
          return (
            <React.Fragment key={stage}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  completed ? "bg-green-500 border-green-500" : "bg-gray-100 border-gray-300"
                } text-white text-xs font-bold`}
              >
                {idx + 1}
              </div>
              {idx < stages.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    completed ? "bg-green-500" : "bg-gray-300"
                  } transition-all duration-500`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (loading) return <p className="text-center py-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Orders Panel</h1>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border rounded-lg p-2 flex-1"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          onClick={() => fetchOrderById(searchId)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-lg cursor-pointer"
            onClick={() => fetchOrderById(order.orderId)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order ID: {order.orderId}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              {statusBadge(order.payment_status)}
              {statusBadge(order.delivery_status)}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="border p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          {/* Order Info */}
          <p className="font-semibold mb-2">Order ID: {selectedOrder.orderId}</p>

          {/* Delivery Progress */}
          {deliveryProgress(selectedOrder.delivery_status)}

          {/* Status Update */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="font-semibold text-gray-700">Delivery Status</label>
              <select
                className="border rounded-lg p-2 mt-1 w-full"
                value={selectedOrder.delivery_status}
                onChange={(e) =>
                  updateOrderStatus("delivery_status", e.target.value)
                }
              >
                {["pending", "shipped", "delivered", "cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-700">Payment Status</label>
              <select
                className="border rounded-lg p-2 mt-1 w-full"
                value={selectedOrder.payment_status}
                onChange={(e) =>
                  updateOrderStatus("payment_status", e.target.value)
                }
              >
                {["pending", "completed", "failed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Products</h3>
            {JSON.parse(selectedOrder.product_details).map((product) => (
              <div key={product.productId} className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <p>{product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">Rs. {product.price}</p>
              </div>
            ))}
          </div>
          <hr className="my-4" />

          {/* Total & Address */}
          <div className="flex justify-between font-bold mb-2">
            
            <span>Total Amount:</span>
            <span>Rs. {selectedOrder.totalAmt}</span>
          </div>

          {selectedOrder.delivery_address ? (
            <div className="text-gray-600 text-sm">
                <hr className="my-2 mt-5 mb-5" />
              <p>User Name: {selectedOrder.userId.name || "N/A"}</p>
              <p>User Email: {selectedOrder.userId.email || "N/A"}</p>
              <hr className="my-2 mt-5 mb-5" />
              <p>Delivery Name: {selectedOrder.delivery_address.name || "N/A"}</p>
              <p>Mobile: {selectedOrder.delivery_address.mobile || "N/A"}</p>
              <p>
                Address: {selectedOrder.delivery_address.address_line || ""},{" "}
                {selectedOrder.delivery_address.city || ""},{" "}
                {selectedOrder.delivery_address.state || ""} -{" "}
                {selectedOrder.delivery_address.pincode || ""}
              </p>
            </div>
          ) : (
            <div className="text-red-500 text-sm">Address not found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
