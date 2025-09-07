import { Outlet } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { HeadProvider } from "react-head";

function App() {
  return (
    <HeadProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <ToastProvider />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </HeadProvider>
  );
}

export default App;
