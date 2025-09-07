// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import ProductsGrid from "./ProductsGrid";
import { Title } from "react-head";



const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await Axios({
        method: SummaryApi.getProducts.method,
        url: SummaryApi.getProducts.url,
      });

      if (!data.error) {
        setProducts(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
    <Title>Home | ShopEase</Title>
    <meta name="google-site-verification" content="suThDJgUAW40HQNLZ0vdnEgVZcu-zk9p3pvj45ExH28" />
      <div className="p-6 max-w-7xl mx-auto">
        <HeroSection />
        <CategoriesSection />
        <ProductsGrid products={products} />
      </div>
    </>
  );
};

export default Home;
