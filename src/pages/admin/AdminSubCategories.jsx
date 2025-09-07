import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";

const AdminSubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await Axios(SummaryApi.getAllCategories);
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
    finally { setLoading(false); }
  };

  // Fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      const { data } = await Axios(SummaryApi.getAllSubCategories);
      if (data.success) setSubCategories(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Create or Update subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !categoryId || (!image && !editId)) {
      toast.error("Please provide name, category and image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", categoryId);
      if (image) formData.append("image", image);

      let response;
      if (editId) {
        //console.log("Updating subcategory with ID:", editId);
        response = await Axios.put(
          `${SummaryApi.updateSubCategory.url}/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        //console.log("Creating new subcategory...");
        response = await Axios.post(SummaryApi.createSubCategory.url, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        toast.success(editId ? "Subcategory updated" : "Subcategory created");
        resetForm();
        fetchSubCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("Error saving subcategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete subcategory
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      //console.log("Deleting subcategory with ID:", id);
      const { data } = await Axios.delete(
        `${SummaryApi.deleteSubCategory.url}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Subcategory deleted");
        fetchSubCategories();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error in handleDelete:", err);
      toast.error("Error deleting subcategory");
    }
  };

  // Search subcategory
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      fetchSubCategories();
      return;
    }
    try {
      setLoading(true);
      console.log("Searching subcategory:", search);
      const { data } = await Axios.get(
        `${SummaryApi.searchSubCategory.url}/${search}`
      );
      if (data.success && data.data) {
        setSubCategories([data.data]);
      } else {
        toast.error(data.message || "Not found");
        setSubCategories([]);
      }
    } catch (err) {
      console.error("Error in handleSearch:", err);
      toast.error("Error searching subcategory");
    }
    finally { setLoading(false); }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setCategoryId("");
    setImage(null);
    setPreview("");
    setEditId(null);
  };

  // Fill form for editing
  const handleEdit = (sub) => {
    //console.log("Editing subcategory:", sub);
    setName(sub.name);
    setCategoryId(sub.categoryId?._id || "");
    setEditId(sub._id);
    setPreview(sub.image);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Manage Subcategories
      </h2>

      {/* Search */}
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
          className="py-3 px-6 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-900 active:scale-95 transition-all duration-200"
        >
          Search
        </button>
      </form>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow space-y-3"
      >
        <h3 className="text-xl font-semibold">
          {editId ? "Edit Subcategory" : "Create New Subcategory"}
        </h3>

        {/* Upload */}
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
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <input
          type="text"
          placeholder="Subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-900 active:scale-95 transition-all duration-200"
          >
            {loading
              ? "Saving..."
              : editId
              ? "Update Subcategory"
              : "Create Subcategory"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-300 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-900 active:scale-95 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {subCategories.length === 0 ? (
        <p className="text-center text-gray-500">No subcategories found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subCategories.map((sub) => (
            <div
              key={sub._id}
              className="border rounded p-3 bg-white flex flex-col items-center shadow"
            >
              <img
                src={sub.image}
                alt={sub.name}
                className="w-24 h-24 object-cover rounded mb-2"
              />
              <p className="font-semibold text-lg">{sub.name}</p>
              <p className="text-sm text-gray-500">
                Category: {sub.categoryId?.name}
              </p>
              <div className="flex gap-2 mt-2 w-full">
                <button
                  onClick={() => handleEdit(sub)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold shadow-md hover:from-yellow-600 hover:to-yellow-900 active:scale-95 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-900 active:scale-95 transition-all duration-200"
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

export default AdminSubCategories;
