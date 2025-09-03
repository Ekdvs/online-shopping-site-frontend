import React from "react";
import { currency } from "../../utils";

const StickyMobileBar = ({ totalPrice, handleAddToCart, handleBuyNow }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white p-3 shadow-lg flex justify-between items-center md:hidden">
      <span className="font-bold text-lg">{currency(totalPrice)}</span>
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default StickyMobileBar;
