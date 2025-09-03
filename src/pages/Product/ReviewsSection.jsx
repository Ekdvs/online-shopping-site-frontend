import React, { useEffect, useMemo, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import ReviewItem from "./ReviewItem";
import Stars from "./Stars";

const Bar = ({ percent = 0 }) => (
  <div className="w-40 bg-gray-200 h-2 rounded overflow-hidden">
    <div className="bg-yellow-400 h-2" style={{ width: `${percent}%` }} />
  </div>
);

const ReviewsSection = ({ productId, product }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await Axios.get(`/api/reviews/${productId}`);
      setReviews(data.reviews || []);
      setStats({
        average: data.average || 0,
        total: data.total || 0,
        distribution: data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    } catch (e) { toast.error("Failed to load reviews"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const distributionPercent = useMemo(() => {
    const total = stats.total || 0;
    const obj = {};
    [5, 4, 3, 2, 1].forEach((s) => { obj[s] = total ? Math.round(((stats.distribution[s] || 0) / total) * 100) : 0; });
    return obj;
  }, [stats]);

  return (
    <div className="bg-white border rounded-lg p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Ratings & Reviews of {product?.name}</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="text-4xl font-bold">{Math.round(stats.average * 10)/10}/<span className="text-2xl">5</span></div>
          <Stars value={stats.average} size="text-xl" />
          <div className="text-sm text-gray-500 mt-1">{stats.total} Ratings</div>
        </div>
        <div className="md:flex-1">
          {[5, 4, 3, 2, 1].map((s) => (
            <div key={s} className="flex items-center gap-3 mb-2">
              <span className="w-10 text-sm">{s} ★</span>
              <Bar percent={distributionPercent[s]} />
              <span className="w-10 text-right text-sm text-gray-600">{stats.distribution?.[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">{loading ? <div className="py-6 text-center text-gray-500">Loading…</div> : reviews.map(r => <ReviewItem key={r._id} r={r} />)}</div>
    </div>
  );
};

export default ReviewsSection;
