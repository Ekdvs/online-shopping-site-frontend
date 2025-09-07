import React, { useState, useEffect } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";

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
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">Your Addresses</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-blue-600 font-medium hover:text-blue-800 transition text-sm"
        >
          + Add New
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p className="text-center py-6 text-gray-500 text-sm">
          No addresses found. Add one above.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div
              key={a._id}
              onClick={() => {
                setSelectedAddress(a);
                onSelect?.(a);
              }}
              className={`p-4 rounded-lg border cursor-pointer transition transform hover:scale-[1.02] 
                ${selectedAddress?._id === a._id 
                  ? "border-blue-500 bg-blue-50 shadow-md" 
                  : "border-gray-200 hover:shadow-md"}`}
            >
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <FaUser className="text-gray-500" />
                {a.name}
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                <FaPhoneAlt className="text-gray-500" />
                {a.mobile}
              </div>
              <div className="flex items-start gap-2 text-gray-700 text-sm mt-2">
                <FaMapMarkerAlt className="text-gray-500 mt-1" />
                <span>
                  {a.address_line}, {a.city}, {a.state}, {a.pincode}
                  <br />
                  {a.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl space-y-4 animate-fadeIn">
            <h2 className="font-bold text-xl text-gray-800">Add New Address</h2>
            <div className="space-y-3">
              {["name","mobile","address_line","city","state","pincode","country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                             text-sm transition"
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                />
              ))}
              <label className="flex items-center gap-2 mt-2 text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={newAddress.default}
                  className="w-4 h-4 accent-blue-600"
                  onChange={(e) => setNewAddress({ ...newAddress, default: e.target.checked })}
                />
                Set as default
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="py-3 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-400 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
