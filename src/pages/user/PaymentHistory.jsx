import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  succeeded: "bg-green-100 text-green-700 border-green-300",
  failed: "bg-red-100 text-red-700 border-red-300",
};

const PaymentHistory = ({ token }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get("/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(data);
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if(loading) return <Loader/>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BanknotesIcon className="h-6 w-6 text-indigo-600" />
        Payment History
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-50 transition-colors text-sm"
                >
                  <td className="p-3 border-b text-gray-700">
                    {payment.orderId}
                  </td>
                  <td className="p-3 border-b font-medium text-gray-900">
                    ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                  </td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[payment.status]}`}
                    >
                      {payment.status === "pending" && (
                        <ClockIcon className="h-4 w-4 inline-block mr-1" />
                      )}
                      {payment.status === "succeeded" && (
                        <CheckCircleIcon className="h-4 w-4 inline-block mr-1" />
                      )}
                      {payment.status === "failed" && (
                        <XCircleIcon className="h-4 w-4 inline-block mr-1" />
                      )}
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3 border-b text-gray-600">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border-b">
                    {payment.receipt_url ? (
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View Receipt
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
