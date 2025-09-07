import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";

const UserAddress = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    default: false,
  });

  const fetchAddresses = async () => {
    try {
      const { data } = await Axios.get(SummaryApi.getAddress.url);
      if (data.success) setAddresses(data.data);
    } catch {
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    const { name, mobile, address_line, city, state, pincode, country } = newAddress;
    if (!name || !mobile || !address_line || !city || !state || !pincode || !country)
      return toast.error("Please fill all fields");

    try {
      const { data } = await Axios.post(SummaryApi.createAddress.url, newAddress);
      if (data.success) {
        toast.success("Address added");
        setShowAddModal(false);
        setNewAddress({
          name: "",
          mobile: "",
          address_line: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          default: false,
        });
        fetchAddresses();
      } else toast.error(data.message || "Failed to add address");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding address");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Your Addresses</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-blue-600 font-medium hover:text-blue-800 transition text-sm"
        >
          + Add New
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No addresses found. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a._id}
              onClick={() => {
                setSelectedAddress(a);
                onSelect(a);
              }}
              className={`p-4 border rounded-lg shadow-sm cursor-pointer transition 
                ${selectedAddress?._id === a._id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:shadow-md"}`}
            >
              <p className="font-medium">{a.name} - {a.mobile}</p>
              <p className="text-gray-700 text-sm">{a.address_line}, {a.city}, {a.state}, {a.pincode}</p>
              <p className="text-gray-700 text-sm">{a.country}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg space-y-4">
            <h2 className="font-bold text-xl">Add New Address</h2>
            <div className="space-y-2">
              {["name","mobile","address_line","city","state","pincode","country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                />
              ))}
              <label className="flex items-center gap-2 mt-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={newAddress.default}
                  className="w-4 h-4"
                  onChange={(e) => setNewAddress({ ...newAddress, default: e.target.checked })}
                />
                Set as default
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleAddAddress}
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddress;
