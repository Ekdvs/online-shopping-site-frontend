import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/public/Home";
import App from "../App";
import Register from "../pages/user/Register";
import Loader from "../components/Loader";
import Login from "../pages/user/Login";
import VerifyEmail from "../pages/user/VerifyEmail";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyOtp from "../pages/user/VerifyOtp";
import ResetPassword from "../pages/user/ResetPassword";
import UserDashboard from "../pages/user/UserDashboard";
import ProductDetails from "../pages/Product/ProductDetails";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path:'/', 
        element: <Home />
      },
      {
        path:'/register', 
        element: <Register/>
      },
      {
        path:'/loader', 
        element: <Loader/>
      },
      {
        path:'/login', 
        element:<Login/>
      },
      {
        path:'/verify-email', 
        element: <VerifyEmail/>
      },
      {
        path:'/forgot-password', 
        element:<ForgotPassword/>
      },
      {
        path:'/verify-forgot-otp', 
        element:<VerifyOtp/>
      },
      {
        path:'/reset-password', 
        element:<ResetPassword/>
      },
      {
        path: "/dashboard",
        element: <UserDashboard/>,
      },
      {
        path: "/:id",
        element: <ProductDetails/>,
      },
      {
        path: "/checkout",
        element: <Checkout/>
      },
      {
        path: "/payment",
        element: <Payment/>
      },
      {
        path: "/checkout",
        element: <Checkout/>
      }
    ]
  }
]);

export default router;



