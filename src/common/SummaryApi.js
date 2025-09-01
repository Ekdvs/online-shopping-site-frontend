
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
}

export default SummaryApi;