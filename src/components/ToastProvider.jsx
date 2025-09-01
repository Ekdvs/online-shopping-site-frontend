
import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          padding: "12px 20px",
          borderRadius: "8px",
          fontWeight: "500",
          fontSize: "15px",
          color: "#fff",
        },
        success: {
          style: { background: "#16a34a" }, // green
          iconTheme: { primary: "#fff", secondary: "#16a34a" },
        },
        error: {
          style: { background: "#dc2626" }, // red
          iconTheme: { primary: "#fff", secondary: "#dc2626" },
        },
        custom: {
          style: { background: "#facc15", color: "#000" }, // yellow for warning
        },
      }}
    />
  );
};

export default ToastProvider;
