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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{category?.name}</h1>

      {/* Subcategories */}
      {subCategories.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
          {subCategories.map((sub) => (
            <div
              key={sub._id}
              onClick={() => navigate(`/subcategory/${sub._id}`)} // ✅ Navigate to subcategory page
              className="cursor-pointer p-4 rounded-lg shadow text-center transition bg-gray-100 hover:shadow-md hover:bg-blue-100"
            >
              <img
                src={sub.image || "https://via.placeholder.com/100"}
                alt={sub.name}
                className="w-16 h-16 mx-auto mb-2 object-cover rounded"
              />
              <p className="text-sm font-medium">{sub.name}</p>
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
