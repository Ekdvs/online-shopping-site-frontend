import { createBrowserRouter } from "react-router-dom";


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
import AdminDashboard from "../pages/admin/AdminDashboard";
import Home from "../pages/Home/Home";
import CategoryProducts from "../pages/CategoryProducts";
import SubcategoryProducts from "../pages/SubcategoryProducts";
import Cart from "../pages/user/Cart";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-forgot-otp", element: <VerifyOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },

      // Protected Routes
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/product/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },

      // Public/Admin Routes
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/category/:name", element: <CategoryProducts /> },
      { path: "/subcategory/:id", element: <SubcategoryProducts /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
]);

export default router;


