import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const SubcategoryProducts = () => {
  const { id } = useParams(); // subcategory ID from URL
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategoryData = async () => {
      try {
        
        const { data } = await Axios({
          method: SummaryApi.getSubCategoryById.method,
          url: `${SummaryApi.getSubCategoryById.url}/${id}`, // append ID
        });

        if (!data.success) {
          toast.error(data.message);
          setLoading(false);
          return;
        }

        setSubCategory(data.data);

 
        const { data: prodRes } = await Axios({
          method: SummaryApi.getProducts.method,
          url: SummaryApi.getProducts.url,
          params: { subCategoryId: data.data._id }, // pass subCategoryId as query
        });

        if (!prodRes.success) {
          toast.error(prodRes.message);
          setProducts([]);
        } else {
          setProducts(prodRes.data || []);
        }
      } catch (err) {
        toast.error("Failed to fetch subcategory products");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategoryData();
  }, [id]);

  if (loading) return <Loader />;

  if (!subCategory) return <p>Subcategory not found</p>;
  if (products.length === 0) return <p>No products in {subCategory.name}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{subCategory.name} Products</h2>
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
            <p className="text-gray-500 text-xs">{prod.categoryId?.name}</p>
            <p className="text-blue-600 font-bold mt-1">${prod.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryProducts;
