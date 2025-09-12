import React from "react";

const Loader = ({
  size = 60,
  colorFrom = "#3B82F6", // Tailwind blue-500
  colorTo = "#06B6D4",   // Tailwind cyan-400
  text = "Loading..."
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-50 space-y-4">
      
      {/* Gradient Spinner */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `4px solid transparent`,
          borderTop: `4px solid ${colorFrom}`,
          borderRight: `4px solid ${colorTo}`,
          animation: "spin 1s linear infinite",
        }}
      ></div>

      {/* Loading Text */}
      <p style={{ color: colorFrom, fontSize: "1.125rem", fontWeight: 600 }}>{text}</p>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
