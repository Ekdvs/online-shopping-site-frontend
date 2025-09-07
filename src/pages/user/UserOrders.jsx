import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios"; // Your configured Axios instance
import toast from "react-hot-toast";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch orders and their addresses
  const fetchOrders = async () => {
    try {
      const { data } = await Axios.get("/api/order/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        // Parse product_details from string to array
        const parsedOrders = data.data.map((order) => ({
          ...order,
          product_details: JSON.parse(order.product_details),
        }));

        // Fetch addresses for each order
        const ordersWithAddress = await Promise.all(
          parsedOrders.map(async (order) => {
            try {
              const res = await Axios.get(
                `/api/address/get/${order.delivery_address._id || order.delivery_address}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...order,
                delivery_address: res.data.success ? res.data.data : null,
              };
            } catch {
              return { ...order, delivery_address: null };
            }
          })
        );

        setOrders(ordersWithAddress);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
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

  if (loading) return <p className="text-center py-10">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center py-10">No orders found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg shadow-sm bg-white">
            {/* Order header */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Order ID: {order.orderId}</span>
              <div className="flex gap-2">
                {/* Payment Status */}
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    order.payment_status === "paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {order.payment_status.toUpperCase()}
                </span>

                {/* Delivery Status */}
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    order.delivery_status === "delivered"
                      ? "bg-green-500"
                      : order.delivery_status === "shipped"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.delivery_status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-2">
              {order.product_details.map((item) => (
                <div key={item._id || item.productId} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-gray-900 mt-4 border-t pt-2">
              <span>Grand Total:</span>
              <span>Rs. {order.totalAmt}</span>
            </div>

            {/* Delivery Address */}
            {order.delivery_address ? (
              <div className="text-gray-600 text-sm mt-2">
                Name: {order.delivery_address.name} <br />
                Mobile: {order.delivery_address.mobile} <br />
                Delivery Address: {order.delivery_address.address_line}, {order.delivery_address.city},{" "}
                {order.delivery_address.state} - {order.delivery_address.pincode}
              </div>
            ) : (
              <div className="text-red-500 text-sm mt-2">Address not found</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
