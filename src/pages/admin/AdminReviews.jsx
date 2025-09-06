import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getAllReviews.method,
        url: SummaryApi.getAllReviews.url,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      if (data.success) setReviews(data.data); // ✅ fix here
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const { data } = await Axios({
        method: SummaryApi.deleteReview.method,
        url: `${SummaryApi.deleteReview.url}/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td className="border p-2">{r.user?.name || r.name || "Unknown"}</td>
                <td className="border p-2">{r.product?.name || "Unknown Product"}</td>
                <td className="border p-2">{r.rating}⭐</td>
                <td className="border p-2">{r.comment}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 active:scale-95"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviews;
