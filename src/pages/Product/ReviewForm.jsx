import React, { useState } from "react";
import toast from "react-hot-toast";
import Stars from "./Stars";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";

const ReviewForm = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return toast.error("You must be logged in to post a review");
    if (!rating) return toast.error("Please select a rating");

    try {
      setSubmitting(true);
      const { data } = await Axios({
        method: SummaryApi.createReview.method,
        url: SummaryApi.createReview.url,
        data: { productId, rating, comment },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data?.message || "Review submitted!");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error) {
      console.error("Review submit error:", error?.response || error);
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 mt-6 transition-all duration-300 border border-gray-200"
    >
      <h4 className="text-lg font-bold mb-4 text-gray-800">Write a Review</h4>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-medium text-gray-700">Your Rating:</span>
        <Stars value={rating} onChange={setRating} editable />
      </div>

      {/* Comment Box */}
      <textarea
        className="w-full border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 rounded-xl p-3 text-sm transition-all duration-200 resize-none"
        placeholder="Share your experience..."
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
