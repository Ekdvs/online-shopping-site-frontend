import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiryDate: "",
    description: "",
    usageLimit: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  //Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getCoupons.method,
        url: SummaryApi.getCoupons.url,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  //Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Reset form
  const resetForm = () => {
    setForm({
      code: "",
      discountPercent: "",
      expiryDate: "",
      description: "",
      usageLimit: "",
    });
    setEditingCoupon(null);
  };

  //Add or Update coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCoupon) {
        // Update
        const { data } = await Axios({
          method: SummaryApi.updateCoupon.method,
          url: `${SummaryApi.updateCoupon.url}/${editingCoupon._id}`,
          headers: { Authorization: `Bearer ${token}` },
          data: form,
          withCredentials: true,
        });

        if (data.success) {
          toast.success("Coupon updated successfully!");
          resetForm();
          fetchCoupons();
        }
      } else {
        // Create
        const { data } = await Axios({
          method: SummaryApi.createCoupon.method,
          url: SummaryApi.createCoupon.url,
          headers: { Authorization: `Bearer ${token}` },
          data: form,
          withCredentials: true,
        });

        if (data.success) {
          toast.success("Coupon created successfully!");
          resetForm();
          fetchCoupons();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  //Delete coupon
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const { data } = await Axios({
        method: SummaryApi.deleteCoupon.method,
        url: `${SummaryApi.deleteCoupon.url}/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Coupon deleted!");
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  //Edit coupon
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiryDate: coupon.expiryDate.split("T")[0],
      description: coupon.description,
      usageLimit: coupon.usageLimit,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {editingCoupon ? "Edit Coupon" : "Create Coupon"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Coupon Code"
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="discountPercent"
          value={form.discountPercent}
          onChange={handleChange}
          placeholder="Discount %"
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="usageLimit"
          value={form.usageLimit}
          onChange={handleChange}
          placeholder="Usage Limit (0 = unlimited)"
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded col-span-2"
        />

        {/* Buttons */}
        <div className="col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-800 active:scale-95 transition-all duration-200"
          >
            {loading
              ? "Saving..."
              : editingCoupon
              ? "Update Coupon"
              : "Create Coupon"}
          </button>

          {editingCoupon && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-800 active:scale-95 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Coupon List */}
      <h2 className="text-xl font-semibold mb-4">All Coupons</h2>
      {coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Code</th>
                <th className="border p-2">Discount %</th>
                <th className="border p-2">Expiry Date</th>
                <th className="border p-2">Usage Limit</th>
                <th className="border p-2">Used</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td className="border p-2">{coupon.code}</td>
                  <td className="border p-2">{coupon.discountPercent}%</td>
                  <td className="border p-2">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {coupon.usageLimit === 0
                      ? "Unlimited"
                      : coupon.usageLimit}
                  </td>
                  <td className="border p-2">{coupon.usedCount}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-600 text-white font-semibold shadow-md hover:from-yellow-600 hover:to-yellow-1000 hover:font-bold active:scale-95 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-1000 hover:font-bold active:scale-95 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
