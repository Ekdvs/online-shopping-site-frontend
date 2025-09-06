import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const CategoryProducts = () => {
  const { name } = useParams(); // category name
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // 1️⃣ Get category
        const { data } = await Axios({
          method: SummaryApi.searchCategory.method,
          url: SummaryApi.searchCategory.url,
          data: { name },
        });

        if (!data.success) return toast.error(data.message);

        setCategory(data.data);

        // 2️⃣ Get products under category
        const { data: prodRes } = await Axios({
          method: SummaryApi.getProducts.method,
          url: SummaryApi.getProducts.url,
          params: { categoryId: data.data._id },
        });

        if (prodRes.success) setProducts(prodRes.data || []);

        // 3️⃣ Optional: Get subcategories under this category
        const { data: subRes } = await Axios({
          method: "GET",
          url: `/api/subcategory/getall`,
          params: { categoryId: data.data._id },
        });

        if (subRes.success) setSubCategories(subRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching category data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [name]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{category?.name}</h1>

      {/* Subcategories */}
      {subCategories.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
          {subCategories.map((sub) => (
            <div
              key={sub._id}
              onClick={() => navigate(`/subcategory/${sub._id}`)}
              className="cursor-pointer p-4 bg-gray-100 rounded-lg shadow hover:shadow-md text-center"
            >
              <img
                src={sub.image || "https://via.placeholder.com/100"}
                alt={sub.name}
                className="w-16 h-16 mx-auto mb-2 object-cover rounded"
              />
              <p className="text-sm">{sub.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              onClick={() => navigate(`/product/${prod._id}`)}
              className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition p-3 flex flex-col"
            >
              <img
                src={prod.image?.[0] || "/placeholder.png"}
                alt={prod.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-sm truncate">{prod.name}</h3>
              <p className="text-blue-600 font-bold mt-1">${prod.price}</p>
              <p className="text-xs text-gray-500">
                {prod.subCategoryId?.name || "General"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
