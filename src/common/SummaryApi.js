
export const baseURL = "https://online-shoping-site-backend-1.onrender.com";

const SummaryApi={
    register:{
        url: "/api/user/register",
        method: "POST",
    },
    login:{
        url: "/api/user/login",
        method: "POST",
    },
}

export default SummaryApi;