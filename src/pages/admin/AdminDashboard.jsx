import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTag,
  FaDatabase,
} from "react-icons/fa";


import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast"; // ✅ use hot-toast instead
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import Loader from "../../components/Loader";
import DashboardContent from "../user/DashboardContent";
import EditProfile from "../user/EditProfile";
import Settings from "../user/Settings";
import AdminCategories from "./AdminCategories";
import AdminSubCategories from "./AdminSubCategories";
import AdminProducts from "./AdminProducts";
import AdminCoupons from "./AdminCoupons";
import AdminReviews from "./AdminReviews";
import OrdersAdmin from "./OrdersAdmin";
import UsersAdmin from "./UsersAdmin";
import PaymentsAdmin from "./AdminPayment";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import AdminDashboardContent from "./DashboardContent";
import AdminNotifications from "./AdminNotifications";



const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("static");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  

  // 🔥 Fetch user
  useEffect(() => {

    

    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await Axios({
          method: SummaryApi.getUser.method,
          url: SummaryApi.getUser.url,
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (data.success) {
          if (data.data.role !== "ADMIN") {
            toast.error("Access denied! Admins only.");
            navigate("/");
          } else {
            setUser(data.data);
          }
        } else {
          toast.error(data.message || "Failed to load user data");
          setError(data.message || "Failed to load user data");
        }
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || "Error fetching user data";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await Axios({
        method: SummaryApi.logout.method,
        url: SummaryApi.logout.url,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed!");
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-600 mb-8 mt-10">Admin <br /> Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "static"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("static")}
          >
            <FaDatabase /> Static Data
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "dashboard"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <FaUser /> Dashboard
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "profile"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <FaUser /> Profile
          </li>
          
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "orders"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("orders")}
          >
            <FaShoppingCart /> Orders
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
                activeSection === "categories"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("categories")}
            >
            <FaShoppingCart /> Categories
        </li>
        <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "subcategories"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("subcategories")}
          >
            <FaShoppingCart /> Subcategories
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "products" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("products")}
          >
            <FaShoppingCart /> Products
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "coupons" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("coupons")}
          >
            <FaTag /> Coupons
          </li>

          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "reviews"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("reviews")}
          >
            <FaBell /> Reviews
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "users"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("users")}
          >
            <FaBell /> User Managment
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "payments"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("payments")}
          >
            <ReceiptPercentIcon className="h-5 w-5 "/> Payment Managment
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "notifications"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("notifications")}
          >
            <FaBell /> Notifications
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "settings"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <FaCog /> Settings
          </li>
          <li
            className="flex items-center gap-2 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
  {activeSection === "dashboard" && <DashboardContent user={user} token={token} onLogout={handleLogout} />}
  {activeSection === "profile" && <EditProfile token={token} currentUser={user} />}
  {activeSection === "orders" && <OrdersAdmin token={token} />}
  {activeSection === "notifications" && <AdminNotifications token={token} />}
  {activeSection === "settings" && <Settings token={token} currentUser={user} />}
  {activeSection === "categories" && <AdminCategories />} 
  {activeSection === "subcategories" && <AdminSubCategories/>}
  {activeSection === "products" && <AdminProducts />}
  {activeSection === "coupons" && <AdminCoupons />}
  {activeSection === "reviews" && <AdminReviews />}
  {activeSection === "users" && <UsersAdmin />}
  {activeSection === "payments" && <div><PaymentsAdmin token={token} /></div>}
  {activeSection === "static" && <AdminDashboardContent user={user} token={token} />}


</main>

    </div>
  );
};

export default AdminDashboard;
