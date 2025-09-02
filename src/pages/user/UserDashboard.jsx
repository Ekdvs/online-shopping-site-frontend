import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingCart, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import DashboardContent from "./DashboardContent";
import EditProfile from "./EditProfile";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔥 Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await Axios({
          method: SummaryApi.getUser.method,
          url: SummaryApi.getUser.url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          setUser(data.user);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <Loader/>
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-90 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-600 mb-8 mt-10">Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "dashboard" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <FaUser /> Dashboard
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "profile" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <FaUser /> Profile
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "orders" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("orders")}
          >
            <FaShoppingCart /> Orders
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "notifications" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
            onClick={() => setActiveSection("notifications")}
          >
            <FaBell /> Notifications
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${
              activeSection === "settings" ? "text-blue-600 font-semibold" : "text-gray-700"
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
        {activeSection === "dashboard" && <DashboardContent user={user} token={token} />}
        {activeSection === "profile" && <EditProfile token={token} currentUser={user} />}
        {activeSection === "orders" && <div>Orders Content</div>}
        {activeSection === "notifications" && <div>Notifications Content</div>}
        {activeSection === "settings" && <div>Settings Content</div>}
      </main>
    </div>
  );
};

export default UserDashboard;
