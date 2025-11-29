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





const AdminDashboard = () => {
  
  const [activeSection, setActiveSection] = useState("static");
 
  

 


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
          
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
  {activeSection === "dashboard" && <DashboardContent />}
  
  {activeSection === "static" && <AdminDashboardContent  />}


</main>

    </div>
  );
};

export default AdminDashboard;
