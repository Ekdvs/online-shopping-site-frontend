import axios from "axios";
import { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";

const Axios=axios.create({
    baseURL:baseURL,
    withCredentials:true,
})

// Automatically add Authorization header
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Save current path before redirect
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default Axios;