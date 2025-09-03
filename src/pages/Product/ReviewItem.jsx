import React from "react";
import Stars from "./Stars";

const VerifiedBadge = () => (
  <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-xs font-medium">✓ Verified Purchase</span>
);

const ReviewItem = ({ r }) => (
  <div className="py-4 border-b">
    <div className="flex items-center gap-2">
      <Stars value={r.rating} />
      <VerifiedBadge />
      <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
    </div>
    <p className="mt-2 text-gray-800">{r.comment}</p>
    {r.image && <img src={r.image} alt="review" className="mt-2 w-20 h-20 object-cover rounded" />}
    <p className="mt-2 text-xs text-gray-500">{r.variantInfo || ""}</p>
    <div className="mt-2 text-xs text-gray-400">by {r.name}</div>
  </div>
);

export default ReviewItem;
