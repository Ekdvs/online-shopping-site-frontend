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
    <div className="w-full h-screen bg-[url('/bglogin.jpg')] bg-cover bg-center flex items-center justify-center ">
      
      {/* Left Section */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-10 bg-black/20 p-10">
        <img src="/ShopEase.png" alt="logo" className="w-[80px] h-[80px] opacity-90 drop-shadow-xl" />
        <h1 className="text-5xl font-bold text-[#FFD700]">Create Your Account</h1>
        <p className="text-gray-200 text-lg w-[400px] text-center italic">
          Join us and start your journey into smart Shoping!
        </p>
        <Link to="/login">
          <button className="px-8 py-3 bg-[#FFD700] text- font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Already have an account?
          </button>
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] h-full bg-black/20 flex items-center justify-center">
        <div className="w-[90%] max-w-[450px] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center gap-8 p-8">
          <div className="">
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

          {/* Forgot Password */}
          <div
            className="text-right text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
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

        <p className="mt-4 text-center text-white">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
      </div>
      </div>
    </div>



    
  );
};

export default Login;
