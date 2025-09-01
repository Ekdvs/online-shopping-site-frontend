import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/public/Home";
import App from "../App";
import Register from "../pages/user/Register";
import Loader from "../components/Loader";
import Login from "../pages/user/Login";
import VerifyEmail from "../pages/user/VerifyEmail";
import ForgotPassword from "../pages/user/ForgotPassword";

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
    ]
  }
]);

export default router;

