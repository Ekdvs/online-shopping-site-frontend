import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon, TrashIcon } from "@heroicons/react/24/solid";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Navigate to password change page
  const passwordChangeHandle = () => {
    navigate("/forgot-password");
  };

  // ❌ Delete account
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await Axios({
        method: "DELETE",
        url: SummaryApi.deleteUser.url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data.success) {
        toast.success("✅ Account deleted successfully!");
        localStorage.removeItem("token");
        navigate("/login");
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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        ⚙️ Account Settings
      </h2>

      <div className="space-y-4">
        {/* Change Password */}
        <button
          onClick={passwordChangeHandle}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <LockClosedIcon className="h-5 w-5" />
          {loading ? "Processing..." : "Change Password"}
        </button>

        {/* Delete Account */}
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <TrashIcon className="h-5 w-5" />
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
