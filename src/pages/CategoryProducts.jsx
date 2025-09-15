import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const CategoryProducts = () => {
  const { name } = useParams(); // category name from URL
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch category + subcategories
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // 1️⃣ Get category details by name
        const { data } = await Axios({
          method: SummaryApi.searchCategory.method,
          url: SummaryApi.searchCategory.url,
          data: { name },
        });

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        setCategory(data.data);

        // 2️⃣ Get subcategories by category id
        const { data: subRes } = await Axios({
          method: SummaryApi.getSubCategoriesByCategory.method,
          url: `${SummaryApi.getSubCategoriesByCategory.url}/${data.data._id}`,
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{category?.name}</h1>

      {/* Subcategories */}
      {subCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {subCategories.map((sub) => (
            <div
              key={sub._id}
              onClick={() => navigate(`/subcategory/${sub._id}`)} // ✅ Navigate to subcategory page
              className="cursor-pointer p-4 rounded-lg shadow text-center transition bg-gray-100 hover:shadow-md hover:bg-blue-100"
            >
             <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-32 md:h-32 mx-auto mb-2 overflow-hidden rounded-lg">
                <img
                  src={sub.image || "https://via.placeholder.com/150"}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <p className="text-sm md:text-base font-medium">{sub.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No subcategories found</p>
      )}
    </div>
  );
};

export default CategoryProducts;
