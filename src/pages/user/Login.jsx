import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import Loader from "../../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard"; // default if no previous page

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await Axios({
        method: SummaryApi.login.method,
        url: SummaryApi.login.url,
        data: formData,
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        localStorage.setItem("token", data.data.accessToken);
        toast.success(data.message || "Login successful!");

        
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

          {/* Forgo  t Password */}
          <div
            className="text-right text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password2222222222222?
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-400 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
