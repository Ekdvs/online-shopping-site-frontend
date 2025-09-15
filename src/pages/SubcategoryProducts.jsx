import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const SubcategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategoryData = async () => {
      try {
        // Get subcategory details
        const { data: subCatRes } = await Axios.get(`${SummaryApi.getSubCategoryById.url}/${id}`);
        if (!subCatRes.success) {
          toast.error(subCatRes.message);
          setLoading(false);
          return;
        }
        setSubCategory(subCatRes.data);

        // Get products under this subcategory
        const { data: prodRes } = await Axios.get(`${SummaryApi.getProductsBySubCategory.url}/${id}`);
        if (!prodRes.success) {
          toast.error(prodRes.message);
          setProducts([]);
        } else {
          setProducts(prodRes.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch subcategory products");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategoryData();
  }, [id]);

  if (loading) return <Loader />;

  if (!subCategory)
    return (
      <p className="text-center text-red-500 text-lg py-10 font-semibold">
        ❌ Subcategory not found
      </p>
    );

  if (products.length === 0)
    return (
      <p className="text-center text-gray-600 text-lg py-10 font-medium">
        No products in <span className="font-bold">{subCategory.name}</span>
      </p>
    );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        {subCategory.name} Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((prod) => (
          <div
            key={prod._id}
            onClick={() => navigate(`/product/${prod._id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition transform hover:-translate-y-1 hover:scale-105 p-4 flex flex-col"
          >
            <div className="w-full h-48 sm:h-56 md:h-48 lg:h-56 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center mb-3">
              <img
                src={prod.image?.[0] || "/placeholder.png"}
                alt={prod.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h3 className="font-semibold text-sm md:text-base text-gray-700 truncate mb-1">
              {prod.name}
            </h3>
            <p className="text-blue-600 font-bold text-sm md:text-base">
              Rs: {prod.price.toFixed(2)}
            </p>
            {prod.discount ? (
              <p className="text-red-500 text-xs mt-1 line-through">
                Rs: {(prod.price + prod.discount).toFixed(2)}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryProducts;
