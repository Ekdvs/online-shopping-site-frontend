import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryApi from '../../common/SummaryApi';
import Loader from '../../components/Loader';
import ToastProvider from '../../components/ToastProvider';
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from '../../utils/Axios';


const ForgotPassword = () => {

  const navigate=useNavigate();
  const[email,setEmail]=useState('');
  const[loading,setLoading]=useState(false);

  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!email){
      toast.error("Email is required");
      return;
    }
    setLoading(true);
    try {
      const {data}=await Axios({
      method:SummaryApi.ForgotPassword.method,
      url:SummaryApi.ForgotPassword.url,
      data:{email},
      headers: { "Content-Type": "application/json" },
    });

    if(data.success){
      toast.success(data.message||"OTP sent to your email")
      navigate("/verify-forgot-otp",{ state: { email } });
    }
    else{
      toast.error(data.message || "Something went wrong");
    }

      
    } catch (error) {
      console.log(error)
      
      toast.error(error.response?.data?.message || "Server error");
    }
    finally{
      setLoading(false);
    }
    
   }

   if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastProvider
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#4CAF50",
              color: "white",
              fontWeight: "bold",
            },
          },
          error: {
            style: {
              background: "#F44336",
              color: "white",
              fontWeight: "bold",
            },
          },
        }}
      />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Forgot Password
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none"
              
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200"
          >
            Send OTP
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
