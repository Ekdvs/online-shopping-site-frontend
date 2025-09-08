import axios from "axios";
import { baseURL } from "../common/SummaryApi";

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

export default Axios;