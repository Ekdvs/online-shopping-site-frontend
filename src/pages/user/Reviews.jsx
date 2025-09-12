import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import { StarIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Loader from "../../components/Loader";

const UserReviews = ({ currentUser, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ rating: 0, comment: "" });
  

  // ✅ Fetch all reviews by this user
  const fetchUserReviews = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const { data } = await Axios.get(`/api/reviews/user/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      toast.error("Failed to fetch your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [currentUser]);

  // ✅ Delete Review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const { data } = await Axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Review deleted");
        fetchUserReviews();
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review");
    }
  };

  // ✅ Start Editing
  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  // ✅ Save Edit
  const handleUpdate = async () => {
    try {
      const { data } = await Axios.put(
        `/api/reviews/update/${editingId}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Review updated");
        setEditingId(null);
        fetchUserReviews();
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Update review error:", error);
      toast.error("Failed to update review");
    }
  };

  if(loading) return <Loader/>

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
        My Reviews
      </h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading your reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 italic">You haven’t written any reviews yet.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-gray-50 to-gray-100"
            >
              {editingId === review._id ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={editData.rating}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="border p-2 w-20 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={editData.comment}
                      onChange={(e) =>
                        setEditData({ ...editData, comment: e.target.value })
                      }
                      className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Update your comment..."
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdate}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200"
            >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="flex items-center text-yellow-500 font-medium">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} className="h-5 w-5" />
                        ))}
                        <span className="ml-2 text-gray-800">
                          {review.comment}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Product:{" "}
                        <span className="font-semibold">
                          {review.product?.name}
                        </span>{" "}
                        | Rs.{review.product?.price}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={() => handleEdit(review)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200"
                    >
                        <PencilSquareIcon className="h-4 w-4" /> Edit
                    </button>

                    <button
                        onClick={() => handleDelete(review._id)}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200"
                    >
                        <TrashIcon className="h-4 w-4" /> Delete
                    </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
