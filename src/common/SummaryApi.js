import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";

export const baseURL = "https://online-shoping-site-backend-1.onrender.com/";
//export const baseURL="http://localhost:8080/";
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


    //address
    createAddress: {
        url: "/api/address/create",
        method: "POST"
    },
    getAddress: {
        url: "/api/address/get",
        method: "GET"
    },
    updateAddress: {
        url: "/api/address/update/:addressId",
        method: "PUT"
    },
    deleteAddress: {
        url: "/api/address/delete/:addressId",
        method: "DELETE"
    },

    //review
    createReview: { 
        url: "/api/reviews/create", 
        method: "POST" 
    },
    getReviews: { 
        url: "/api/reviews/getall/:productId", 
        method: "GET" 
    },
    updateReview: { 
        url: "/api/reviews/update/:reviewId", 
        method: "PUT" 
    },
    deleteReview: { 
        url: "/api/reviews/:reviewId", 
        method: "DELETE" 
    },

      // ✅ Cart
    createCartItem: {
      method: "POST",
      url: "/api/cart/create",
    },
    getCart: {
      url: "/api/cart/get",
      method: "GET",
    },
    updateCart: {
      url: "/api/cart/update",
      method: "PUT",
    },
    deleteCart: {
      url: "/api/cart/delete",
      method: "DELETE",
    },
    clearCart: { 
      method: "DELETE", 
      url: "/api/cart/clear" },

    // ✅ Orders
    createOrder: {
      method: "POST",
      url: "/api/order/create",
    },
    getOrders: {
      method: "GET",
      url: "/api/order/list",
    },
    getOrderById: {
      method: "GET",
      url: "/api/order/:id",
    },
    getUserOrders: {
      method: "GET",
      url: "/api/order/getuser",
    },
    updateOrder: {
    url: "/api/order/update", // adjust if your backend route differs
    method: "PUT",
  },

    createCategory: { 
      method: "POST", 
      url: "/api/category/create" 
    },
    getAllCategories: { 
      method: "GET", 
      url: "/api/category/getall" 
    },
    updateCategory: { 
      method: "PUT", 
      url: "/api/category/update" 
    },
    deleteCategory: { 
      method: "DELETE", 
      url: "/api/category/delete" 
    },
    searchCategory: { 
      method: "POST", 
      url: "/api/category/search" 
    },

    createSubCategory: {
      url: "/api/subcategory/create",
      method: "POST",
    },
    getAllSubCategories: {
      url: "/api/subCategory/getall",
      method: "GET",
    },
    updateSubCategory: {
      url: "/api/subCategory/update",
      method: "PUT",
    },
    deleteSubCategory: {
      url: "/api/subCategory/delete",
      method: "DELETE"
    },
    searchSubCategory: {
      url: "/api/subCategory/search",
      method: "GET"
    },
    getSubCategoryById: {
      url: "/api/subcategory/get", 
      method: "GET",
   },
    getSubCategoriesByCategory: {
        method: "GET",
        url: "/api/subcategory/byCategory", // we will append /:idOrName later
    },
    createProduct: {
      url: "/api/products/create",
      method: "POST",
    },
    getProducts: {
      url: "/api/products/getAll",
      method: "GET",
    },
    updateProduct: {
      url: "/api/products/update",
      method: "PUT",
    },
    deleteProduct: {
      url: "/api/products/delete",
      method: "DELETE",
    },
    searchProduct: {
      url: "/api/products/search",
      method: "GET",
    },

    createCoupon: { 
      method: "POST", 
      url: "/api/coupon/create" 
    },
    getCoupons: { 
      method: "GET", 
      url: "/api/coupon/getall" 
    },
    updateCoupon: { 
      method: "PUT", 
      url: "/api/coupon/update" 
    },
    deleteCoupon: { 
      method: "DELETE",
      url: "/api/coupon/delete" 
    },
    applyCoupon: {
      url: "/api/coupon/apply", 
      method: "POST",
    },

    getAllReviews: { 
      method: "GET", 
      url: "/api/reviews/admin/getall" 
    },
    deleteReview: { 
      method: "DELETE", 
      url: "/api/reviews" 
    },
    createPaymentIntent: { url: "/api/payments/create-intent", method: "POST" },



}

export default SummaryApi;