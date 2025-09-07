import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";

// UserAddress Component
const UserAddress = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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
      let res;
      if (SummaryApi.getAddress.method.toLowerCase() === "get") {
        res = await Axios.get(SummaryApi.getAddress.url);
      } else {
        res = await Axios.post(SummaryApi.getAddress.url);
      }
      if (res.data.success) setAddresses(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelect = (address) => {
    setSelectedId(address._id);
    if (onSelect) onSelect(address);
  };

  const handleAddAddress = async () => {
    const { name, mobile, address_line, city, state, pincode, country } = newAddress;
    if (!name || !mobile || !address_line || !city || !state || !pincode || !country) {
      return toast.error("Please fill all fields");
    }

    try {
      let res;
      if (SummaryApi.createAddress.method.toLowerCase() === "post") {
        res = await Axios.post(SummaryApi.createAddress.url, newAddress);
      } else {
        res = await Axios.get(SummaryApi.createAddress.url, { params: newAddress });
      }

      if (res.data.success) {
        toast.success("Address added");
        setShowAddModal(false);
        setNewAddress({ name: "", mobile: "", address_line: "", city: "", state: "", pincode: "", country: "", default: false });
        fetchAddresses();
      } else {
        toast.error(res.data.message || "Failed to add address");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding address");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Delivery Address</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-blue-600 font-medium hover:text-blue-800 transition"
        >
          + Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No addresses found. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a._id}
              onClick={() => handleSelect(a)}
              className={`p-4 border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition 
                ${selectedId === a._id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200"}`}
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
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                />
              ))}
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={newAddress.default}
                  className="w-4 h-4"
                  onChange={(e) => setNewAddress({ ...newAddress, default: e.target.checked })}
                />
                <span className="text-gray-700">Set as default</span>
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

// Checkout Component
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  if (!orderData) {
    return (
      <div className="text-center py-20">
        <p className="mb-3 text-gray-500">No order data found.</p>
        <button onClick={() => navigate("/cart")} className="text-blue-600 font-medium hover:text-blue-800 transition">Go to Cart</button>
      </div>
    );
  }

  const { items, deliveryFee } = orderData;
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const itemsTotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const grandTotal = useMemo(() => itemsTotal + deliveryFee - discount, [itemsTotal, deliveryFee, discount]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("Enter a coupon code");
    try {
      let res;
      if (SummaryApi.applyCoupon.method.toLowerCase() === "post") {
        res = await Axios.post(SummaryApi.applyCoupon.url, { couponCode });
      } else {
        res = await Axios.get(SummaryApi.applyCoupon.url, { params: { couponCode } });
      }
      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        toast.success(`Coupon applied! You saved Rs. ${res.data.discountAmount}`);
      } else {
        toast.error(res.data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying coupon");
    }
  };

  const handleProceedToPay = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address");
    const orderPayload = {
      product_details: items,
      delivery_address: selectedAddress._id,
      subTotalAmt: itemsTotal,
      totalAmt: grandTotal,
      payment_status: "pending",
      payment_id: `COD-${Date.now()}`,
    };

    try {
      let res;
      if (SummaryApi.createOrder.method.toLowerCase() === "post") {
        res = await Axios.post(SummaryApi.createOrder.url, orderPayload);
      } else {
        res = await Axios.get(SummaryApi.createOrder.url, { params: orderPayload });
      }
      if (res.data.success) {
        toast.success("Order created successfully!");
        navigate("/payment", { state: { order: res.data.data } });
      } else {
        toast.error(res.data.message || "Failed to create order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Addresses */}
      <div className="border p-4 rounded-lg shadow-sm">
        <UserAddress onSelect={setSelectedAddress} />
        {selectedAddress && (
          <div className="mt-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded shadow-inner">
            <p className="font-medium"><strong>Selected:</strong> {selectedAddress.name} - {selectedAddress.mobile}</p>
            <p className="text-gray-700 text-sm">{selectedAddress.address_line}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.pincode}</p>
            <p className="text-gray-700 text-sm">{selectedAddress.country}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="border p-4 rounded-lg shadow-sm">
        <h2 className="font-bold text-lg mb-3">Order Items</h2>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center my-3 border-b pb-2 last:border-b-0">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium text-gray-800">Rs. {item.price}</p>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border p-4 rounded-lg shadow-sm space-y-3">
        <h2 className="font-bold text-lg mb-2">Order Summary</h2>
        <div className="flex justify-between text-gray-700">
          <span>Items Total:</span><span>Rs. {itemsTotal}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery Fee:</span><span>Rs. {deliveryFee}</span>
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loadingCoupon}
          >
            {loadingCoupon ? "Applying..." : "Apply"}
          </button>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount:</span><span>- Rs. {discount}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-orange-600 text-lg">
          <span>Total:</span><span>Rs. {grandTotal}</span>
        </div>

        <button
          onClick={handleProceedToPay}
          className="mt-4 w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
          disabled={creatingOrder}
        >
          {creatingOrder ? "Creating Order..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
