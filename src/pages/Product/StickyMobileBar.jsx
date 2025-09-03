import React from "react";
import Quantity from "./Quantity";
import { currency } from "../../utils";

const StickyMobileBar = ({ price, discount = 0, quantity, setQuantity }) => {
  const totalPrice = quantity * price;
  const totalOriginal = quantity * (price + discount);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex justify-between items-center md:hidden z-50">
      <div className="flex items-center gap-2">
        <Quantity value={quantity} setValue={setQuantity} />
        <div className="ml-2 text-lg font-semibold text-gray-800">
          {currency(totalPrice)}
          {discount > 0 && (
            <span className="line-through text-gray-400 text-sm ml-1">{currency(totalOriginal)}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add to Cart</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Buy Now</button>
      </div>
    </div>
  );
};

export default StickyMobileBar;
