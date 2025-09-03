import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios"; 
import SummaryApi from "../../common/SummaryApi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 Save settings (dark mode, notifications)
  const handleSave = () => {
    toast.success("Settings updated successfully!");
  };

  //password change
  const passwordChangeHandle = async () => {
    navigate("/forgot-password");
  };

  // 🔹 Delete account (calls backend)
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await Axios({
        method: "DELETE",
        url: SummaryApi.deleteUser.url, // 🔥 Your backend endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Account deleted successfully!");
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login
      } else {
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      {/* Dark Mode */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700">Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-500 rounded-full"></div>
          <span className="ml-3 text-sm text-gray-600">
            {darkMode ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>

      {/* Email Notifications */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700">Email Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-500 rounded-full"></div>
          <span className="ml-3 text-sm text-gray-600">
            {emailNotifications ? "On" : "Off"}
          </span>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition mb-4"
      >
        Save Changes
      </button>
      {/* Pass word Change */}
      <button
        onClick={passwordChangeHandle}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>

      {/* Delete Account */}
      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
};

export default Settings;
