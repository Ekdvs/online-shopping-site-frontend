import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import ImageGallery from "./ImageGallery";
import Quantity from "./Quantity";
import StickyMobileBar from "./StickyMobileBar";
import UserAddress from "./UserAddress";
import ReviewsSection from "./ReviewsSection";
import { AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { currency } from "../../utils";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Product Section */}
      <div className="md:flex gap-8">
        {/* Images */}
        <div className="md:w-1/2">
          <ImageGallery images={product.image} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {product.name}
          </h1>

          <p className="text-gray-700 text-base md:text-lg">{product.description}</p>

          {/* Ratings */}
          <ReviewsSection productId={id} product={product} />

          {/* Price */}
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {currency(product.price)}
            {product.discount > 0 && (
              <span className="line-through text-gray-400 text-base md:text-lg ml-2">
                {currency(product.price + product.discount)}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-3">
            <Quantity value={quantity} setValue={setQuantity} />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-200 hidden md:inline">
              Add to Cart
            </button>
            <button className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition duration-200 hidden md:inline">
              Buy Now
            </button>
            <button className="border px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center">
              <AiOutlineHeart size={20} />
            </button>
            <button className="border px-4 py-3 rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center">
              <AiOutlineShareAlt size={20} />
            </button>
          </div>

          {/* User Address */}
          <UserAddress />
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection productId={id} product={product} />

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        price={product.price}
        discount={product.discount}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </div>
  );
};

export default ProductDetails;
