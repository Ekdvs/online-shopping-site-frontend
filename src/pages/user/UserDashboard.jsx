import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";

const UserDashboard = () => {
  // ⚡ Define activeSection state
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    // add your logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-90 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">My Dashboard</h1>
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
          <li className="flex items-center gap-2 cursor-pointer text-red-500" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeSection === "dashboard" && <div>Dashboard Content</div>}
        {activeSection === "profile" && <div>Profile Content</div>}
        {activeSection === "orders" && <div>Orders Content</div>}
        {activeSection === "notifications" && <div>Notifications Content</div>}
        {activeSection === "settings" && <div>Settings Content</div>}
      </main>
    </div>
  );
};

export default UserDashboard;
