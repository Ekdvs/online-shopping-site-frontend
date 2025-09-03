import React from "react";
import { Mail, Phone, Shield, Calendar, LogOut } from "lucide-react";
import Loader from "../../components/Loader";

const DashboardContent = ({ user, loading, error, onLogout }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Welcome, {user.name.split(" ")[0]}! 🎉
      </h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-100">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-md overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{user.name[0]}</span>
          )}
        </div>

        {/* Name & Role */}
        <h3 className="mt-4 text-2xl font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.role}</p>

        {/* User Details */}
        <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
            <Mail className="text-blue-600" size={18} />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
            <Phone className="text-blue-600" size={18} />
            <span>{user.mobile || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
            <Shield className="text-blue-600" size={18} />
            <span>{user.status}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
            <Calendar className="text-blue-600" size={18} />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-2xl shadow text-white">
          <h4 className="text-lg font-semibold">Orders</h4>
          <p className="text-3xl font-bold">{user.orderHistory?.length || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-6 rounded-2xl shadow text-white">
          <h4 className="text-lg font-semibold">Cart</h4>
          <p className="text-3xl font-bold">{user.shopping_cart?.length || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 rounded-2xl shadow text-white">
          <h4 className="text-lg font-semibold">Address</h4>
          <p className="text-3xl font-bold">{user.address_details?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
