import { createBrowserRouter } from "react-router-dom";


import App from "../App";
import Register from "../pages/user/Register";
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
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import TermsConditions from "../pages/TermsConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ShippingReturns from "../pages/ShippingReturns";
import PaymentForm from "../pages/Payment";
import OrderSuccess from "../pages/OrderSuccess";
import OrderDetails from "../pages/OrderDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-forgot-otp", element: <VerifyOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/terms&conditions", element: <TermsConditions /> },
      { path: "/privacypolicy", element: <PrivacyPolicy /> },
      { path: "/shipping&returns", element: <ShippingReturns /> },
       { path: "/ordersuccess", element: <OrderSuccess /> },

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
            <PaymentForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/ordershow/:orderId",
        element: (
          <PrivateRoute>
            <OrderDetails />
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


