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
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-lg rounded-2xl max-w-md mx-auto mt-8 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-center mb-6">Edit Profile</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={preview || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border mb-2"
        />
        <label className="text-sm text-gray-600">Upload Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="mt-2"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditProfile;
