// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, LogIn, UserPlus, Search, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const Navbar = ({ searchKeyword, setSearchKeyword }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      if (!token) {
        setCartCount(0);
        return;
      }
      const { data } = await Axios({
        method: SummaryApi.getCart.method,
        url: SummaryApi.getCart.url,
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(data.success && Array.isArray(data.data) ? data.data.length : 0);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // Scroll effect for sticky auto-hide
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Focus mobile search input
  useEffect(() => {
    if (mobileSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [mobileSearch]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) navigate("/shop");
    setMobileSearch(false);
    if (isOpen) setIsOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md"
            : "bg-gradient-to-r from-[#1E3A8A] via-[#00B5D8] to-[#8B5CF6]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div
              className={`text-2xl font-extrabold tracking-wide transition duration-300 ${
                scrolled ? "text-[#1E3A8A]" : "text-white"
              } cursor-pointer`}
              onClick={() => navigate("/")}
            >
              ShopEase
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 mx-4">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00B5D8] shadow-sm placeholder-gray-400 bg-white"
              />
            </form>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {["Home", "Shop", "About", "Contact"].map((item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `transition duration-300 px-3 py-2 rounded-md font-bold ${
                      isActive
                        ? "text-white bg-[#E0F7FA]"
                        : "text-white hover:text-[#00B5D8] hover:bg-white/20"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}

              {/* Cart */}
              <NavLink to="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#00B5D8] transition duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FB923C] text-black text-xs rounded-full px-1 font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/*account*/}
              <NavLink to="/dashboard" className="relative group">
              <User className="w-6 h-6 text-white group-hover:text-[#00B5D8] transition duration-300" />
              </NavLink>

              {/* Always show Login/Register */}
              <NavLink
                to="/login"
                className="px-4 py-2 bg-[#FB923C] text-black rounded-lg font-medium hover:bg-[#F97316] transition duration-300 shadow flex items-center gap-1"
              >
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 bg-[#00B5D8] text-white rounded-lg font-medium hover:bg-[#008FA3] transition duration-300 shadow flex items-center gap-1"
              >
                <UserPlus size={18} /> Register
              </NavLink>

              {/* Mobile Search Icon */}
              <button className="md:hidden ml-2 text-white" onClick={() => setMobileSearch(true)}>
                <Search className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`transition duration-300 ${
                  scrolled ? "text-gray-800 hover:text-[#00B5D8]" : "text-white hover:text-[#00B5D8]"
                }`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          {["Home", "Shop", "About", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition duration-300 font-bold ${
                  isActive
                    ? "bg-[#00B5D8] text-white"
                    : "text-gray-700 hover:bg-[#E0F7FA] hover:text-[#00B5D8]"
                }`
              }
            >
              {item}
            </NavLink>
          ))}

          <NavLink
            to="/cart"
            className="flex items-center text-gray-700 hover:text-[#00B5D8] transition duration-300"
          >
            <ShoppingCart className="w-5 h-5 mr-2" /> Cart
            {cartCount > 0 && (
              <span className="ml-2 bg-[#FB923C] text-black text-xs rounded-full px-2 font-bold">
                {cartCount}
              </span>
            )}
          </NavLink>

          <NavLink 
          to='/dashboard'
          className="flex items-center text-gray-700 hover:text-[#00B5D8] transition duration-300"
          >
          <User  className="w-5 h-5 mr-2" /> Account
          
          </NavLink>


          {/* Mobile Login/Register */}
          <NavLink
            to="/login"
            className="block w-full text-center px-4 py-2 bg-[#FB923C] text-black rounded-lg font-medium hover:bg-[#F97316] transition duration-300"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="block w-full text-center px-4 py-2 bg-[#00B5D8] text-white rounded-lg font-medium hover:bg-[#008FA3] transition duration-300"
          >
            Register
          </NavLink>
        </div>
      </div>

      {/* Mobile Full-Screen Search Overlay */}
      {mobileSearch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center px-4">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-md flex items-center bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-3 outline-none text-gray-800"
            />
            <button
              type="button"
              onClick={() => setMobileSearch(false)}
              className="px-4 text-gray-700 hover:text-gray-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
