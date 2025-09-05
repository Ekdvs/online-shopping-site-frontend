import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getAllCategories.method,
        url: SummaryApi.getAllCategories.url,
      });
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!image && !editId)) {
      toast.error("Please provide name and image");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("image", image);

      let response;
      if (editId) {
        // update
        response = await Axios({
          method: SummaryApi.updateCategory.method,
          url: `${SummaryApi.updateCategory.url}/${editId}`,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // create
        response = await Axios({
          method: SummaryApi.createCategory.method,
          url: SummaryApi.createCategory.url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(editId ? "Category updated" : "Category created");
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (name) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const { data } = await Axios({
        method: SummaryApi.deleteCategory.method,
        url: SummaryApi.deleteCategory.url,
        data: { name },
      });
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
    }
  };

  // Search category by name
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      fetchCategories();
      return;
    }
    try {
      const { data } = await Axios({
        method: SummaryApi.searchCategory.method,
        url: SummaryApi.searchCategory.url,
        data: { name: search },
      });
      if (data.success) {
        setCategories([data.data]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error searching category");
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setImage(null);
    setEditId(null);
  };

  // Edit category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    setImage(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Categories</h2>

      {/* Create / Update Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow space-y-3"
      >
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Category"
              : "Create Category"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex gap-2 bg-white p-3 rounded shadow"
      >
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="border rounded p-3 bg-white flex flex-col items-center shadow"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-24 h-24 object-cover rounded mb-2"
            />
            <p className="font-semibold text-lg">{cat.name}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.name)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
