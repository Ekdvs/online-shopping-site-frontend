import React from "react";

const Stars = ({ value = 0, size = "text-base" }) => {
  const v = Math.round(value);
  return (
    <div className={`flex items-center ${size}`} aria-label={`${value}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}
    </div>
  );
};

export default Stars;
