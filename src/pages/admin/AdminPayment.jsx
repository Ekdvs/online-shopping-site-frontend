import React, { useEffect, useState } from "react";
// your axios instance
import SummaryApi from "../../common/SummaryApi"; // API URLs
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(SummaryApi.getAllPayments.url, {
        withCredentials: true,
      });
      if (res.data.success) {
        setPayments(res.data.payments);
        setFiltered(res.data.payments);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Search filter
  useEffect(() => {
    const query = search.toLowerCase();
    const f = payments.filter(
      (p) =>
        p.orderId.toLowerCase().includes(query) ||
        p.userId?.name?.toLowerCase().includes(query) ||
        p.userId?.email?.toLowerCase().includes(query)
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [search, payments]);

  // Pagination slice
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // Export CSV
  const exportCSV = () => {
    const header = [
      "Order ID",
      "User",
      "Email",
      "Amount (LKR)",
      "Amount (USD)",
      "Status",
      "Date",
    ];
    const rows = filtered.map((p) => [
      p.orderId,
      p.userId?.name,
      p.userId?.email,
      p.amountLKR,
      p.amountUSD,
      p.status,
      new Date(p.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Payment History</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by order/user/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-72"
          />
          <button
            onClick={exportCSV}
            className=" py-3 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-400 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">User</th>
                <th className="px-4 py-3 border">Amount</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentRows.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{p.orderId}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{p.userId?.name}</p>
                      <p className="text-xs text-gray-500">{p.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    Rs. {p.amount}
                    <br />
                    
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        p.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsAdmin;
