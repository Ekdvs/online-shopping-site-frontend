import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";

//export const baseURL = "https://online-shoping-site-backend-1.onrender.com";
export const baseURL="http://localhost:8080/";
const SummaryApi={
    register:{
        url: "/api/user/register",
        method: "POST",
    },
    login:{
        url: "/api/user/login",
        method: "POST",
    },
    verifyEmail: {
        url: "/api/user/verify-email",
        method: "POST",
    },
    ForgotPassword: {
        url: "/api/user/forgot-password",
        method: "POST",
    },
    verifyForgotOtp: {
        url: "/api/user/verify-forgot-otp",
        method: "POST",
    },
    ResetPassword: {
        url: "/api/user/reset-password",
        method: "POST",
    },
    getUser: { 
        url: "/api/user/me", 
        method: "GET" 
    },
    updateUser: { 
        url: "/api/user/update-user", 
        method: "PUT" 
    },
     uploadAvatar: { 
        url: "/api/user/upload-avatar", 
        method: "PUT" 
    },
    logout:{
        url:"/api/user/logout",
        method: "POST"
    },

    //products
    getProducts:{
        url:"/api/products/getall",
        method: "GET"
    },
    getProduct: {
        url: "/api/products/getbyid/:id",
        method: "GET"
    },

}

export default SummaryApi;