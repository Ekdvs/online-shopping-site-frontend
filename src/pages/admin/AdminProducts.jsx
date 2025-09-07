import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import ToastProvider from "../../components/ToastProvider";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Form fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // actual files
  const [previews, setPreviews] = useState([]); // preview URLs

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getAllCategories.method,
        url: SummaryApi.getAllCategories.url,
      });
      if (data.success) setCategories(data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getAllSubCategories.method,
        url: SummaryApi.getAllSubCategories.url,
      });
      if (data.success) setSubCategories(data.data);
    } catch {
      toast.error("Failed to load subcategories");
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getProducts.method,
        url: SummaryApi.getProducts.url,
      });
      if (data.success) setProducts(data.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
  }, []);

  // Handle Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !categoryId || !unit || !stock || !price) {
      toast.error("Please fill required fields");
      return;
    }
    if (images.length > 5) {
      toast.error("You can upload max 5 images");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", categoryId);
      if (subCategoryId) formData.append("sub_categoryId", subCategoryId);
      formData.append("unit", unit);
      formData.append("stock", stock);
      formData.append("price", price);
      if (discount) formData.append("discount", discount);
      if (description) formData.append("description", description);
      images.forEach((img) => formData.append("images", img));

      let response;
      if (editId) {
        response = await Axios({
          method: SummaryApi.updateProduct.method,
          url: `${SummaryApi.updateProduct.url}/${editId}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await Axios({
          method: SummaryApi.createProduct.method,
          url: SummaryApi.createProduct.url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.data.success) {
        toast.success(editId ? "Product updated" : "Product created");
        resetForm();
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      const { data } = await Axios({
        method: SummaryApi.deleteProduct.method,
        url: `${SummaryApi.deleteProduct.url}/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else toast.error(data.message);
    } catch {
      toast.error("Error deleting product");
    }
  };

  // Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return fetchProducts();
    try {
      const { data } = await Axios({
        method: SummaryApi.searchProduct.method,
        url: `${SummaryApi.searchProduct.url}?keyword=${search}`,
      });
      if (data.success) setProducts(data.data);
    } catch {
      toast.error("Error searching products");
    }
  };

  // Edit
  const handleEdit = (prod) => {
    setEditId(prod._id);
    setName(prod.name);
    setCategoryId(prod.categoryId?._id || "");
    setSubCategoryId(prod.sub_categoryId?._id || "");
    setUnit(prod.unit);
    setStock(prod.stock);
    setPrice(prod.price);
    setDiscount(prod.discount || "");
    setDescription(prod.description || "");
    setImages([]);
    setPreviews(prod.image || []); // show existing product images
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setCategoryId("");
    setSubCategoryId("");
    setUnit("");
    setStock("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setImages([]);
    setPreviews([]);
    setEditId(null);
  };

  // Handle image upload with preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can select max 5 images");
      return;
    }
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Remove one preview
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // ✅ Reset subCategoryId when category changes
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    setSubCategoryId(""); // reset subcategory
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastProvider />
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Products</h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2 bg-white p-3 rounded shadow">
        <input
          type="text"
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          className="py-3 px-6 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-1000 active:scale-95 transition-all"
        >
          Search
        </button>
      </form>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow space-y-3">
        <h3 className="text-xl font-semibold">{editId ? "Edit Product" : "Create New Product"}</h3>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <select
          value={categoryId}
          onChange={handleCategoryChange}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select SubCategory</option>
          {subCategories
            .filter((sc) => sc.categoryId?._id === categoryId) // ✅ only show subcategories of selected category
            .map((sc) => (
              <option key={sc._id} value={sc._id}>
                {sc.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Unit (e.g. pcs, kg)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full"
        />

        {/* Image Upload + Preview */}
        <div className="flex flex-col items-center mb-3 w-full">
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <svg
                className="w-8 h-8 mb-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-400">Max 5 images (PNG, JPG, JPEG)</p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 active:scale-95 transition-all"
          >
            {loading ? "Saving..." : editId ? "Update Product" : "Create Product"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-300 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-1000 active:scale-95 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((prod) => (
            <div key={prod._id} className="border rounded p-3 bg-white flex flex-col items-center shadow">
              <img
                src={prod.image[0]}
                alt={prod.name}
                className="w-24 h-24 object-cover rounded mb-2"
              />
              <p className="font-semibold text-lg">{prod.name}</p>
              <p className="text-sm text-gray-500">Price: ${prod.price}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold shadow-md hover:from-yellow-600 active:scale-95"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
