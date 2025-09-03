import React from "react";
import Stars from "./Stars";

const VerifiedBadge = () => (
  <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">
    ✓ Verified
  </span>
);

const ReviewItem = ({ r }) => (
  <div className="p-4 mb-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
    {/* Header: Rating + Date */}
    <div className="flex items-center gap-2 mb-2">
      <Stars value={r.rating} />
      <VerifiedBadge />
      <span className="text-xs text-gray-500 ml-auto">
        {new Date(r.createdAt).toLocaleDateString()}
      </span>
    </div>

    {/* Comment */}
    <p className="text-gray-800 text-sm leading-relaxed">{r.comment}</p>

    {/* Image */}
    {r.image && (
      <div className="mt-3">
        <img
          src={r.image}
          alt="review"
          className="w-24 h-24 rounded-lg object-cover border border-gray-300"
        />
      </div>
    )}

    {/* Variant */}
    {r.variantInfo && (
      <p className="mt-2 text-xs text-gray-500 italic">{r.variantInfo}</p>
    )}

    {/* Reviewer */}
    <div className="mt-3 text-xs text-gray-500 font-medium">
      — {r.name || "Anonymous"}
    </div>
  </div>
);

export default ReviewItem;
