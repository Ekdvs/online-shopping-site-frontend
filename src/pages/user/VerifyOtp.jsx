import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../../common/SummaryApi";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { FaEnvelope, FaKey } from "react-icons/fa";
import Axios from "../../utils/Axios";


const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromPrev = location.state?.email || "";

  const [email, setEmail] = useState(emailFromPrev);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromPrev) {
      toast.error("No email found. Please request OTP again.");
      navigate("/forgot-password");
    }
  }, [emailFromPrev, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Both Email and OTP are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await Axios({
        method: SummaryApi.verifyForgotOtp.method,
        url: SummaryApi.verifyForgotOtp.url,
        data: { email, otp },
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        toast.success(data.message || "OTP verified successfully");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Verify OTP
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email (read-only) */}
          <div className="flex items-center gap-2 border rounded p-2 bg-gray-100">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              value={email}
              readOnly
              className="flex-1 outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* OTP */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaKey className="text-gray-400" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200"
          >
            Verify OTP
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Didn't get OTP?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
