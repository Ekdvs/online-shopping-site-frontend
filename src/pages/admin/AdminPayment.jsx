import React, { useEffect, useState } from "react";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import Loader from "../../components/Loader";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch payments
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
      "Amount (USD)",
      "Status",
      "Date",
      "Receipt URL",
    ];
    const rows = filtered.map((p) => [
      p.orderId,
      p.userId?.name,
      p.userId?.email,
      p.amount,
      p.status,
      new Date(p.createdAt).toLocaleString(),
      p.receipt_url || "N/A",
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by order/user/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <button
            onClick={exportCSV}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200"
        >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
       <Loader/>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 border">Order ID</th>
                <th className="px-4 py-3 border">User</th>
                <th className="px-4 py-3 border">Amount (USD)</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentRows.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono text-gray-700">{p.orderId}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{p.userId?.name}</p>
                      <p className="text-xs text-gray-500">{p.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">Rs/{p.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
                  <td className="px-4 py-3 text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {p.receipt_url ? (
                      <a
                        href={p.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-400 active:scale-95 transition-all duration-200" ${
                currentPage === i + 1
                  ? " text-white border-blue-600 bg-amber-400"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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
