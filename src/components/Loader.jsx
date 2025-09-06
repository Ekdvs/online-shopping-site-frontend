import React from "react";

const Loader = ({ size = 16, color = "blue-500", text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-50 space-y-4">
      
      <div
        className={`w-${size} h-${size} border-4 border-${color} border-t-transparent border-dashed rounded-full animate-spin`}
      ></div>

      
      <p className={`text-${color} text-lg font-semibold`}>{text}</p>
    </div>
  );
};

export default Loader;
