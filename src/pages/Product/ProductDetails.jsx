import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import ImageGallery from "./ImageGallery";
import Quantity from "./Quantity";
import StickyMobileBar from "./StickyMobileBar";
import UserAddress from './UserAddress'
import ReviewsSection from "./ReviewsSection";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import { AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { currency } from "../../utils";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("token");

  if(!token) {
    toast.error("Please login to view product details");
    window.location.href = "/login";
  }

  // Dynamic total price
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return product.price * quantity;
  }, [product, quantity]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await Axios.get(
          SummaryApi.getProduct.url.replace(":id", id)
        );
        if (data.success) setProduct(data.data);
        else toast.error("Product not found");
      } catch (e) {
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Product not found
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 bg-gray-50 min-h-screen">
      {/* Product Section */}
      <div className="md:flex gap-8 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        {/* Images */}
        <div className="md:w-1/2">
          <ImageGallery images={product.image} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-6">
          {/* Category / Subcategory */}
          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600">
            {product.categoryId?.name && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {product.categoryId?.name}
              </span>
            )}
            {product.sub_categoryId?.name && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {product.sub_categoryId?.name}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* Stock */}
          <div className="text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {product.description || "No description available"}
          </p>

          {/* Additional Details */}
          {product.more_Details && (
            <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-2">
              <h4 className="font-semibold text-gray-800">
                Product Details:
              </h4>
              {Object.entries(JSON.parse(product.more_Details)).map(
                ([key, value]) => (
                  <p key={key} className="text-gray-700 capitalize">
                    <span className="font-medium">{key}: </span>
                    {value}
                  </p>
                )
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="mt-2 space-y-1">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              {currency(product.price)}
              {product.discount > 0 && (
                <span className="line-through text-gray-400 text-lg md:text-xl font-medium">
                  {currency(product.price + product.discount)}
                </span>
              )}
            </div>
            <p className="text-lg text-gray-700">
              Total Rs :{" "}
              <span className="font-bold text-blue-600">
                {currency(totalPrice)}
              </span>
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-medium text-gray-700">Quantity:</span>
            <Quantity value={quantity} setValue={setQuantity} />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <AddToCartButton productId={product._id} quantity={quantity} />
            <BuyNowButton product={product} quantity={quantity} />
            <button className="border px-4 py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center shadow-sm">
              <AiOutlineHeart className="text-gray-600" size={22} />
            </button>
            <button className="border px-4 py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center shadow-sm">
              <AiOutlineShareAlt className="text-gray-600" size={22} />
            </button>
          </div>

          
          
        </div>
      </div>

      {/* Address Selection */}
      <div className="border p-4 rounded-lg shadow-sm bg-white">
        <UserAddress onSelect={setSelectedAddress} />
        {!selectedAddress && <p className="mt-2 text-red-500 text-sm">Please select a delivery address to proceed.</p>}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <ReviewsSection productId={id} product={product} />
      </div>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
  product={product}
  quantity={quantity}
  totalPrice={totalPrice}
/>
    </div>
  );
};

export default ProductDetails;
