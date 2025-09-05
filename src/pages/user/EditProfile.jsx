import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ token, currentUser = {} }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    mobile: currentUser?.mobile || "",
    image: null,
  });

  const [preview, setPreview] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("mobile", formData.mobile);
      if (formData.image) dataToSend.append("avatar", formData.image);

      const { data } = await Axios.put(SummaryApi.updateUser.url, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data?.message || "Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !currentUser.name)
    return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-transform hover:scale-[1.01]"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Edit Your Profile
        </h2>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
        {/* Avatar Preview */}
        <img
          src={preview || "/default-avatar.png"}
          alt="avatar preview"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-md mb-3 transition-transform duration-200 hover:scale-105"
        />

        {/* Upload Button */}
        <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none transition">
          Upload New Avatar
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* Helper text */}
        <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 2MB</p>
      </div>


        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Mobile */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
