import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AddressForm from "./AddressForm";

const UserAddress = () => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchAddress = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.getAddress.method,
        url: SummaryApi.getAddress.url,
        headers: { Authorization: `Bearer ${token}` },
      });

      // If API returns an array of addresses, pick the latest one
      if (Array.isArray(data.data) && data.data.length > 0) {
        const latestAddress = data.data[data.data.length - 1];
        setAddress(latestAddress);
      } else {
        setAddress(data.data || null);
      }
    } catch (e) {
      toast.error("Failed to fetch address");
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [token]);

  if (!token)
    return <div className="text-sm text-gray-500 mt-4">Login to see your saved address</div>;

  if (loading)
    return <div className="text-sm text-gray-500 mt-4">Loading...</div>;

  return (
    <div className="bg-white border rounded p-4 mt-4 space-y-4">
      {address ? (
        <>
          <div>
            <h4 className="font-semibold mb-2">Your Address</h4>
            <p>{address.address_line}</p>
            <p>
              {address.city}, {address.state} {address.pincode}
            </p>
            <p>{address.country}</p>
            <p>Mobile: {address.mobile}</p>
          </div>
          {/* Inline-edit form for existing address */}
          <AddressForm
            existingAddress={address}
            onSuccess={fetchAddress}
            autoSave={true} // enable auto-save on change
          />
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500 mt-4">No saved address</p>
          {/* Add new address */}
          <AddressForm onSuccess={fetchAddress} autoSave={true} />
        </>
      )}
    </div>
  );
};

export default UserAddress;
