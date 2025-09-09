import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import ToastProvider from "../../components/ToastProvider";
import Loader from "../../components/Loader";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); // ✅ preview image
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); // ✅ your JWT

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.getAllCategories.method,
        url: SummaryApi.getAllCategories.url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to load categories");
    }
    finally {
      setLoading(false);
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
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // create
        response = await Axios({
          method: SummaryApi.createCategory.method,
          url: SummaryApi.createCategory.url,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
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
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.deleteCategory.method,
        url: SummaryApi.deleteCategory.url,
        data: { name },
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    finally{
      setLoading(false);
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
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.searchCategory.method,
        url: SummaryApi.searchCategory.url,
        data: { name: search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setCategories([data.data]);
      } else {
        toast.error(data.message);
        setCategories([]); // clear results if not found
      }
    } catch (error) {
      console.error(error);
      toast.error("Error searching category");
    }
    finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setImage(null);
    setPreview("");
    setEditId(null);
  };

  // Edit category
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    setImage(null); // reset file input
    setPreview(cat.image); // ✅ show existing image
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastProvider />

      <h2 className="text-2xl font-bold mb-6 text-center">Manage Categories</h2>
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
          className=" py-3 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Create / Update Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow space-y-3"
      >
        <h3 className="text-xl font-semibold">
          {editId ? "Edit Category" : "Create New Category"}
        </h3>
        

        {/* Image Upload + Preview */}
        <div className="flex flex-col items-center mb-3 w-full">
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow mb-3"
            />
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
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG (max 2MB)</p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0])); // ✅ new preview
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-300 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Category List */}
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found</p>
      ) : (
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
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold shadow-md hover:from-yellow-600 hover:to-yellow-1000 hover:font-bold active:scale-95 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.name)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200"
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

export default AdminCategories;
