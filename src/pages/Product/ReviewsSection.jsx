import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import Stars from "./Stars";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";

const Bar = ({ percent = 0 }) => (
  <div className="w-40 bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
    <div
      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 transition-all duration-300"
      style={{ width: `${percent}%` }}
    />
  </div>
);

const ReviewsSection = ({ productId, product }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.getReviews.method,
        url: SummaryApi.getReviews.url.replace(":productId", productId),
      });

      setReviews(data.reviews || []);
      setStats({
        average: data.average || 0,
        total: data.total || 0,
        distribution: data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    } catch (e) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const distributionPercent = useMemo(() => {
    const total = stats.total || 0;
    const obj = {};
    [5, 4, 3, 2, 1].forEach((s) => {
      obj[s] = total
        ? Math.round(((stats.distribution[s] || 0) / total) * 100)
        : 0;
    });
    return obj;
  }, [stats]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Ratings & Reviews for <span className="text-blue-600">{product?.name}</span>
      </h3>

      {/* Stats Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-6">
        {/* Average Rating */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center border rounded-lg p-4 bg-gray-50">
          <div className="text-5xl font-extrabold text-yellow-500">
            {Math.round(stats.average * 10) / 10}
            <span className="text-2xl text-gray-700">/5</span>
          </div>
          <Stars value={stats.average} size="text-2xl" />
          <div className="text-sm text-gray-500 mt-2">{stats.total} Ratings</div>
        </div>

        {/* Distribution */}
        <div className="md:flex-1">
          {[5, 4, 3, 2, 1].map((s) => (
            <div
              key={s}
              className="flex items-center gap-3 mb-3 hover:bg-gray-50 rounded-lg p-2 transition"
            >
              <span className="w-10 text-sm font-medium text-gray-700">{s} ★</span>
              <Bar percent={distributionPercent[s]} />
              <span className="w-10 text-right text-sm text-gray-600">
                {stats.distribution?.[s] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <ReviewForm productId={productId} onSuccess={fetchReviews} />

      {/* Reviews List */}
      <div className="mt-6">
        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm animate-pulse">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <ReviewItem key={r._id} r={r} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
