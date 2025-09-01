
import React from "react";

const Loader = ({ size = 16, color = "blue-600", text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      {/* Rotating cart icon */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-dashed animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Text */}
      <p className="text-gray-700 text-lg font-medium">{text}</p>
    </div>
  );
};

export default Loader;
