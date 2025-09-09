import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import {
  UserIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/user/allusers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await Axios.delete(`/api/user/delete/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  // Change user role
  const changeRole = async (userId, newRole) => {
    try {
      const response = await Axios.put(
        `/api/user/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.data.success) {
        toast.success("User role updated");
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, role: response.data.data.role } : u
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">Avatar</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.mobile || "—"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    {/* Change Role */}
                    {user.role === "USER" ? (
                      <button
                        onClick={() => changeRole(user._id, "ADMIN")}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center gap-1"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => changeRole(user._id, "USER")}
                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition flex items-center gap-1"
                      >
                        <ShieldExclamationIcon className="w-5 h-5" />
                        Remove Admin
                      </button>
                    )}

                    {/* Delete User */}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <TrashIcon className="w-5 h-5" />
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

export default UsersAdmin;
