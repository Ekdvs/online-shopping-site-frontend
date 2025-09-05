import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    unit: "",
    categoryId: "",
    sub_categoryId: "",
    description: "",
    discount: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await Axios.get(SummaryApi.getAllProducts.url);
      if (data.success) setProducts(data.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  // ✅ Fetch categories + subcategories
  const fetchCategories = async () => {
    try {
      const { data } = await Axios.get(SummaryApi.getAllCategories.url);
      if (data.success) setCategories(data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const { data } = await Axios.get(SummaryApi.getAllSubCategories.url);
      if (data.success) setSubCategories(data.data);
    } catch {
      toast.error("Failed to load subcategories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Create product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.unit ||
      !formData.categoryId ||
      !image
    ) {
      toast.error("Fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      form.append("images", image);

      const { data } = await Axios.post(SummaryApi.createProduct.url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Product created!");
        fetchProducts();
        setFormData({
          name: "",
          price: "",
          stock: "",
          unit: "",
          categoryId: "",
          sub_categoryId: "",
          description: "",
          discount: "",
        });
        setImage(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${SummaryApi.deleteProduct.url}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted!");
      fetchProducts();
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Create Product Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit (e.g. pcs, kg)"
          value={formData.unit}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />

        {/* ✅ Dropdown Category */}
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* ✅ Dropdown SubCategory */}
        <select
          name="sub_categoryId"
          value={formData.sub_categoryId}
          onChange={handleChange}
          className="border rounded-lg p-2"
        >
          <option value="">Select SubCategory</option>
          {subCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="col-span-2 border rounded-lg p-2"
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={formData.discount}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="col-span-2 border rounded-lg p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>

      {/* Product List */}
      <h3 className="text-lg font-semibold mb-3">All Products</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-3 shadow-sm">
            <img
              src={p.image[0]}
              alt={p.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h4 className="font-bold">{p.name}</h4>
            <p className="text-sm text-gray-600">
              ${p.price} | Stock: {p.stock}
            </p>
            <button
              onClick={() => handleDelete(p._id)}
              className="mt-2 text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
