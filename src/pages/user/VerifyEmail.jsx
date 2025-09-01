import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import Loader from "../../components/Loader";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      setLoading(false);
      toast.error("Verification link is missing!");
      return;
    }

    const verify = async () => {
      try {
        // Send POST request with code in body
        const { data } = await Axios.post(SummaryApi.verifyEmail.url, { code });

        if (data.success) {
          setStatus("success");
          toast.success(data.message || "✅ Email verified successfully!");
          // Redirect to login after 2s
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("error");
          toast.error(data.message || "❌ Invalid or expired link.");
        }
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Something went wrong!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        {status === "success" ? (
          <p className="text-green-600 font-bold text-lg">
            ✅ Email verified successfully! Redirecting to login...
          </p>
        ) : (
          <div>
            <p className="text-red-600 font-bold text-lg mb-4">
              ❌ Invalid or expired verification link.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Resend Verification Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
