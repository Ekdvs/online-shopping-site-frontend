import React from "react";

const Quantity = ({ value, setValue, max = 99 }) => (
  <div className="inline-flex items-center gap-2">
    {/* Decrease Button */}
    <button
      onClick={() => setValue((prev) => Math.max(1, prev - 1))}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 
                 hover:bg-red-100 hover:scale-105 active:scale-95 shadow-sm transition"
      aria-label="Decrease quantity"
    >
      −
    </button>

    {/* Input Field */}
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) setValue(Math.min(Math.max(1, n), max));
      }}
      className="w-16 h-10 text-center rounded-lg border border-gray-300 
                 text-gray-800 font-semibold focus:ring-2 focus:ring-blue-400 
                 focus:border-blue-400 outline-none transition"
    />

    {/* Increase Button */}
    <button
      onClick={() => setValue((prev) => Math.min(max, prev + 1))}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 
                 hover:bg-green-100 hover:scale-105 active:scale-95 shadow-sm transition"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export default Quantity;
