// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getAllCategories.method,
        url: SummaryApi.getAllCategories.url,
      });

      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Categories</h2>

      {categories.length === 0 ? (
        <p className="text-gray-600">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat.name}`)} 
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl p-5 flex flex-col items-center justify-center transition-all duration-300 border border-gray-100 hover:border-blue-500 hover:scale-105 group"
            >
              {/* Category Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-hidden border mb-3 rounded-xl">
                <img
                  src={cat.image || "https://via.placeholder.com/150"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              {/* Category Name */}
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
