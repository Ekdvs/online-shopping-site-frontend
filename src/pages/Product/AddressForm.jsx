import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const AddressForm = ({ existingAddress, onSuccess, autoSave = false }) => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingAddress) {
      setForm({
        address_line: existingAddress.address_line || "",
        city: existingAddress.city || "",
        state: existingAddress.state || "",
        pincode: existingAddress.pincode || "",
        country: existingAddress.country || "",
        mobile: existingAddress.mobile || "",
      });
    }
  }, [existingAddress]);

  const saveAddress = async (updatedForm) => {
    if (!token) return toast.error("Login first");
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.createAddress.method,
        url: SummaryApi.createAddress.url,
        data: updatedForm,
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message || "Address saved");
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving address");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    if (autoSave) {
      saveAddress(updatedForm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAddress(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 space-y-3 mt-4"
    >
      {["address_line", "city", "state", "pincode", "country", "mobile"].map(
        (field) => (
          <input
            key={field}
            type={field === "mobile" ? "tel" : "text"}
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={form[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            required
          />
        )
      )}
      {!autoSave && (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      )}
    </form>
  );
};

export default AddressForm;
