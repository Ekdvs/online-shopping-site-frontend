import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../utils/Axios";
import Loader from "../../components/Loader";
import { getSocket } from "../../utils/Socket";

const AdminNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await Axios.get("/api/notifications/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setNotifications(data.data);
    } catch (err) {
      console.error("Fetch admin notifications failed:", err);
      toast.error("Failed to load admin notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    const socket = getSocket(token);
    if (!socket) return;

    const handleAdminNotification = (note) => {
      setNotifications((prev) => [note, ...prev]);
      toast.success("🔔 New admin notification!");
    };

    socket.on("newAdminNotification", handleAdminNotification);

    return () => socket.off("newAdminNotification", handleAdminNotification);
  }, [token]);

  const markAsRead = async (id) => {
    try {
      const { data } = await Axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? data.data : n))
        );
      }
    } catch (err) {
      console.error("Mark as read failed:", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { data } = await Axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        toast.success("Deleted notification");
      }
    } catch (err) {
      console.error("Delete notification failed:", err);
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">📢 Admin Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded-lg flex flex-col justify-between items-start ${
                n.read ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{n.message}</p>
                  <small className="text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="flex gap-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-300 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-red-300 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-300 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Display meta data if exists */}
              {n.meta && Object.keys(n.meta).length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded w-full text-sm text-gray-700">
                  {Object.entries(n.meta).map(([key, value]) => (
                    <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;
