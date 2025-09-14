// src/pages/ShopPage.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductsGrid from "./ProductsGrid";

const ShopPage = () => {
  // ✅ get global searchKeyword from Outlet context
  const { searchKeyword } = useOutletContext();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <ProductsGrid searchKeyword={searchKeyword} />
    </div>
  );
};

export default ShopPage;
