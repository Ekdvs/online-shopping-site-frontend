
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductsGrid = ({ products }) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <h2 className="text-lg font-semibold text-gray-600">
          No Products Found
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((prod) => {
          const imageUrl = prod.image?.[0] || "/placeholder.png";
          const price = prod.price || 0;
          const discount = prod.discount || 0;
          const finalPrice = discount > 0 ? price - discount : price;
          const averageRating = Math.round(prod.averageRating || 0);

          return (
            <div
              key={prod._id}
              className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition p-3 flex flex-col"
              onClick={() => navigate(`/product/${prod._id}`)} // ✅ route fixed
            >
              <img
                src={imageUrl}
                alt={prod.name || "Product"}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="font-semibold text-sm truncate">
                {prod.name || "Unnamed Product"}
              </h2>
              <p className="text-gray-500 text-xs truncate">
                {prod.categoryId?.name || "Uncategorized"}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <p className="text-blue-600 font-bold">${finalPrice}</p>
                {discount > 0 && (
                  <p className="text-red-500 text-xs line-through">${price}</p>
                )}
              </div>

              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`${
                      index < averageRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-gray-500 text-xs ml-2">
                  ({prod.totalReviews || 0})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsGrid;
