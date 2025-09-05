import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import ToastProvider from "../../components/ToastProvider";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ FIX added

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic regex validations
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  const isValidName = (name) => /^[a-zA-Z ]{2,50}$/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (!isValidName(name)) {
      toast.error("Name must be 2-50 characters, letters only");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error(
        "Password must be at least 8 chars, include uppercase, lowercase, number & special char"
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true); // ✅ show loading
      const { data } = await Axios({
        method: SummaryApi.register.method,
        url: SummaryApi.register.url,
        data: { name, email, password },
        headers: { "Content-Type": "application/json" },
      });

      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(
          "Registration successful! Check your email for verification."
        );
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false); // ✅ hide loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastProvider position="top-right" reverseOrder={false} />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="flex-1 outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="text-gray-400 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading} // ✅ disable while loading
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
