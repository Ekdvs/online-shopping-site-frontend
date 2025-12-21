import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import ToastProvider from "../../components/ToastProvider";
import { Title } from "react-head";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";


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

   // FIXED Google Login
  const googleLogin = useGoogleLogin(
    {
      flow:'implicit',
      onSuccess:async(response)=>{
        try {
          const backendRes = await Axios({
            method:SummaryApi.googleLogin.method,
            url:SummaryApi.googleLogin.url,
            data: {
              access_token: response.access_token, 
            },
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials:true

          })

          if(backendRes.data.success){
            const newToken = backendRes.data.data.accessToken;
            

            //save token local storage
            localStorage.setItem("token",newToken)
            Axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

            toast.success('Google Login Successful! ')

            //redirect user
            const role = backendRes.data.data.updateUser.role;
            
            if(role === 'ADMIN'){
              navigate('/admin')
            }
            else if(role === 'USER'){
              navigate('/dashboard')
            }else{
              navigate('/')
            }

          }
          
        } catch (error) {
            console.log(error);
            toast.error("Google login failed!");
        }
      },
      onError: () => toast.error("Google login failed!"),
    }
  )

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
    <>
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-cover bg-center flex items-center justify-center">
      
      {/* Left Section */}
      <div className="hidden lg:flex w-[50%] h-full flex-col items-center justify-center gap-10 bg-black/50 p-10">
        <img src="/ShopEase.png" alt="logo" className="w-[180px] h-[180px] object-contain opacity-90 drop-shadow-lg" />
        <h1 className="text-5xl font-bold text-[#FFD700]">Create Your Account</h1>
        <p className="text-gray-200 text-lg w-[400px] text-center italic">
          Join ShopEase and experience next-generation technology at your fingertips.
        </p>
        <Link to="/login">
          <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Already have an account?
          </button>
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] h-full bg-black/50 flex items-center justify-center">
        <div className="w-[90%] max-w-[450px] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center gap-8 p-8">
          
          <ToastProvider position="top-right" reverseOrder={false} />
          <div className=" p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
              Register
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 text-white placeholder-gray-400">
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
              <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 text-white placeholder-gray-400">
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
              <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 text-white placeholder-gray-400">
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
              <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 text-white placeholder-gray-400">
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
              {/* Divider */}
              <div className="flex items-center w-full gap-2 mt-4">
                <div className="flex-1 h-[1px] bg-gray-400"></div>
                <p className="text-white text-sm">or</p>
                <div className="flex-1 h-[1px] bg-gray-400"></div>
              </div>

              {/* Google Register/Login */}
              <button
                type="button"
                onClick={() => googleLogin()}
                className="flex items-center justify-center gap-3 w-full py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100"
              >
                <FcGoogle size={22} /> Continue with Google
              </button>
            </form>

            <p className="mt-4 text-center text-white">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
    
        </div>
      </div>
    </div>
    
    </>
  );
};

export default Register;
