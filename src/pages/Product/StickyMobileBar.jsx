import React from "react";
import { currency } from "../../utils";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

const StickyMobileBar = ({ product, quantity, totalPrice }) => {
  if (!product) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4 flex justify-between items-center md:hidden z-50">
      {/* Total Price */}
      <span className="font-bold text-xl text-gray-800">
        {currency(totalPrice)}
      </span>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <AddToCartButton productId={product._id} quantity={quantity} />
        <BuyNowButton product={product} quantity={quantity} />
      </div>
    </div>
  );
};

export default StickyMobileBar;
