import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/public/Home";
import App from "../App";
import Register from "../pages/user/Register";
import Loader from "../components/Loader";

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
      }
    ]
  }
]);

export default router;
