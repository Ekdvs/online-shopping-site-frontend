import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const AdminDashboardContent = ({ user, token }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    dailyRevenue: [],
    paymentStatus: [],
    dailyUsers: [],
    latestOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await Axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setStats(data.data);
        } else {
          toast.error(data.message || "Failed to fetch stats");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Error fetching stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading)
    return (
      <Loader/>
    );

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-600 font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">
            Rs : {stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
          {stats.dailyRevenue.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#007BFF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No revenue data</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          {stats.paymentStatus.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.paymentStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.paymentStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No payment data</p>
          )}
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Latest Orders</h2>
        {stats.latestOrders.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Payment Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Delivery Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.latestOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm">{order.orderId}</td>
                    <td className="px-4 py-2 text-sm">{order.userName}</td>
                    <td className="px-4 py-2 text-sm">
                      ${order.totalAmt.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">{order.payment_status}</td>
                    <td className="px-4 py-2 text-sm">{order.delivery_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No orders yet</p>
        )}
      </div>

      {/* User Registrations Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Registrations</h2>
        {stats.dailyUsers.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#00C49F"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No registration data</p>
        )}
      </div>

      {/* Stripe Dashboard Link */}
      <div className="text-center mt-6">
        <a
          href="https://dashboard.stripe.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
          Go to Stripe Dashboard
        </a>
      </div>

      
    </div>
  );
};

export default AdminDashboardContent;
