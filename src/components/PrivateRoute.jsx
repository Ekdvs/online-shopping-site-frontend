import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let isValid = false;

  if (token) {
    try {
      const decoded = jwtDecode(token); // decode without verifying
      const now = Date.now() / 1000; // in seconds
      if (decoded.exp && decoded.exp > now) {
        isValid = true; // token is not expired
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  if (!isValid) {
    // Clear invalid token
    localStorage.removeItem("token");
    // Redirect to login and save previous path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
