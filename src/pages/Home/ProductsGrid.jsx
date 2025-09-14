import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

// Debounce utility
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const ProductsGrid = ({ searchKeyword }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", subCategory: "", minPrice: "", maxPrice: "", inStock: false });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await Axios.get(SummaryApi.getAllCategories.url);
      if (data.success) setCategories(data.data);
    } catch { toast.error("Failed to fetch categories"); }
  };

  const fetchSubCategories = async (categoryName) => {
    if (!categoryName) return setSubCategories([]);
    try {
      const { data } = await Axios.get(`${SummaryApi.getSubCategoriesByCategory.url}/${categoryName}`);
      if (data.success) setSubCategories(data.data); else setSubCategories([]);
    } catch { setSubCategories([]); }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchKeyword?.trim()) params.append("keyword", searchKeyword.trim());
      if (filters.category) params.append("category", filters.category);
      if (filters.subCategory) params.append("subCategory", filters.subCategory);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.inStock) params.append("inStock", true);

      const { data } = await Axios.get(`${SummaryApi.getProducts.url}?${params.toString()}`);
      if (data.success) setProducts(data.data); else setProducts([]);
    } catch (err) {
      console.error(err);
      setProducts([]);
      toast.error("Failed to fetch products");
    } finally { setLoading(false); }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 300), [searchKeyword, filters]);

  useEffect(() => { fetchCategories(); fetchProducts(); }, []);
  useEffect(() => { debouncedFetchProducts(); }, [searchKeyword, filters, debouncedFetchProducts]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "category") {
      setFilters(prev => ({ ...prev, subCategory: "" }));
      fetchSubCategories(value);
    }
  };

  const highlightText = (text) => {
    if (!searchKeyword) return text;
    const parts = text.split(new RegExp(`(${searchKeyword})`, "gi"));
    return parts.map((part, i) => part.toLowerCase() === searchKeyword.toLowerCase() ? <span key={i} className="bg-yellow-200 px-1 rounded">{part}</span> : part);
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded shadow">
        <select name="category" value={filters.category} onChange={handleFilterChange} className="px-4 py-2 border rounded">
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
        {subCategories.length > 0 && (
          <select name="subCategory" value={filters.subCategory} onChange={handleFilterChange} className="px-4 py-2 border rounded">
            <option value="">All Subcategories</option>
            {subCategories.map(sub => <option key={sub._id} value={sub.name}>{sub.name}</option>)}
          </select>
        )}
        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" className="px-4 py-2 border rounded w-[100px]" />
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="px-4 py-2 border rounded w-[100px]" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" checked={filters.inStock} onChange={handleFilterChange} className="h-4 w-4 accent-blue-500" /> In Stock Only
        </label>
        <button onClick={() => setFilters({ category: "", subCategory: "", minPrice: "", maxPrice: "", inStock: false })} className="px-4 py-2 bg-gray-200 rounded">Clear Filters</button>
      </div>

      {/* Loading / Empty / Grid */}
      {loading && <div className="text-center py-10 text-gray-500 font-semibold">Loading...</div>}
      {!loading && products.length === 0 && <div className="text-center py-20 text-gray-500 font-semibold">No Products Found</div>}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map(prod => {
            const imageUrl = prod.image?.[0] || "/placeholder.png";
            const price = prod.price || 0;
            const discount = prod.discount || 0;
            const finalPrice = discount > 0 ? price + discount : price;
            const averageRating = Math.round(prod.averageRating || 0);

            return (
              <div key={prod._id} className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition p-4 flex flex-col" onClick={() => navigate(`/product/${prod._id}`)}>
                <img src={imageUrl} alt={prod.name || "Product"} className="w-full h-40 object-cover rounded mb-2" />
                <h2 className="font-semibold text-sm truncate">{highlightText(prod.name || "Unnamed Product")}</h2>
                <p className="text-gray-500 text-xs truncate">{prod.categoryId?.name || "Uncategorized"}</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-blue-600 font-bold">Rs:{price}</p>
                  {discount > 0 && <p className="text-red-500 text-xs line-through">Rs:{finalPrice}</p>}
                </div>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i} className={`${i < averageRating ? "text-yellow-400" : "text-gray-300"}`}>★</span>)}
                  <span className="text-gray-500 text-xs ml-2">({prod.totalReviews || 0})</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
