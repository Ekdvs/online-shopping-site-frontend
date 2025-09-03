import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";

const UserAddress = () => {
  const [address, setAddress] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchAddress = async () => {
      try {
        const { data } = await Axios.get("/api/address/get", { headers: { Authorization: `Bearer ${token}` } });
        setAddress(data.data);
      } catch (e) { toast.error("Failed to fetch address"); }
    };
    fetchAddress();
  }, [token]);

  if (!token) return <div className="text-sm text-gray-500 mt-4">Login to see your saved address</div>;
  if (!address) return <div className="text-sm text-gray-500 mt-4">No saved address</div>;

  return (
    <div className="bg-white border rounded p-4 mt-4">
      <h4 className="font-semibold mb-2">Your Address</h4>
      <p>{address.address_line}</p>
      <p>{address.city}, {address.state} {address.pincode}</p>
      <p>{address.country}</p>
      <p>Mobile: {address.mobile}</p>
    </div>
  );
};

export default UserAddress;
