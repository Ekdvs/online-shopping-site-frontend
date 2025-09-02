import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Axios from "../../utils/Axios";

// Reusable Eye Toggle Component
const EyeToggle = ({ show, toggle }) => (
  <div
    className="cursor-pointer p-2 border border-white rounded-lg bg-gray-100 hover:bg-blue-50 hover:border-blue-600 transition-colors"
    onClick={toggle}
  >
    {show ? (
      <AiFillEyeInvisible className="text-gray-500 hover:text-blue-600" />
    ) : (
      <AiFillEye className="text-gray-500 hover:text-blue-600" />
    )}
  </div>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromPrev = location.state?.email || "";

  const [email] = useState(emailFromPrev);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!emailFromPrev) {
      toast.error("No email found. Please request OTP again.");
      navigate("/forgot-password");
    }
  }, [emailFromPrev, navigate]);

  const validatePassword = (pwd) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(pwd))
      return "Password must be at least 8 characters long";
    if (!upper.test(pwd))
      return "Password must include at least one uppercase letter";
    if (!number.test(pwd))
      return "Password must include at least one number";
    if (!special.test(pwd))
      return "Password must include at least one special character";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await Axios({
        method: SummaryApi.ResetPassword.method,
        url: SummaryApi.ResetPassword.url,
        data: { email, password },
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        toast.success(data.message || "Password reset successfully");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Reset Password
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex items-center gap-2 border rounded p-2 bg-gray-100">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              value={email}
              readOnly
              className="flex-1 outline-none bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* New Password */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 relative">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none"
              required
            />
            <EyeToggle
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-2 border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 relative">
            <FaLock className="text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 outline-none"
              required
            />
            <EyeToggle
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {/* Inline Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Remember your password?{" "}
          <span
            onClick={() => setTimeout(() => navigate("/login"), 1500)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
