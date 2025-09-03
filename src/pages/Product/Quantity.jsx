import React from "react";

const Quantity = ({ value, setValue, max = 99 }) => (
  <div className="inline-flex items-center border rounded-lg overflow-hidden shadow-sm">
    {/* Decrease Button */}
    <button
      onClick={() => setValue((prev) => Math.max(1, prev - 1))}
      className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 text-lg font-semibold transition"
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
      className="w-16 text-center outline-none border-x border-gray-300 px-2 py-2 text-gray-800 font-medium focus:ring-2 focus:ring-blue-400 transition"
    />

    {/* Increase Button */}
    <button
      onClick={() => setValue((prev) => Math.min(max, prev + 1))}
      className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 text-lg font-semibold transition"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

export default Quantity;
