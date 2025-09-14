import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { HeadProvider } from "react-head";
import { connectSocket, disconnectSocket, getSocket } from "./utils/Socket";



function App() {
   const [searchKeyword, setSearchKeyword] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const sock = connectSocket(token, import.meta.env.VITE_API_WS_URL || "http://localhost:8080");
      
      sock.on("connect", () => {
        console.log("✅ Socket connected:", sock.id);
      });

      sock.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    return () => {
      disconnectSocket();
    };
  }, []);

   return (
    <HeadProvider>
      <div className="flex flex-col min-h-screen">
        {/* ✅ Pass global search state to Navbar */}
        <Navbar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
        <ToastProvider />
        <main className="flex-1 bg-gray-50">
          {/* ✅ Provide searchKeyword to child pages */}
          <Outlet context={{ searchKeyword }} />
        </main>
        <Footer />
      </div>
    </HeadProvider>
  );
}

export default App;
