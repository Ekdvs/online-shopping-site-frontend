import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogIn, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-[#1E3A8A] via-[#00B5D8] to-[#8B5CF6]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className={`flex-shrink-0 flex items-center text-2xl font-extrabold tracking-wide transition duration-300 ${
              scrolled ? "text-[#1E3A8A]" : "text-white"
            }`}
          >
            ShopEase
          </div>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex items-center flex-1 mx-4">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00B5D8] shadow-sm placeholder-gray-400 bg-white"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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
            <NavLink to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#00B5D8] transition duration-300" />
              <span className="absolute -top-2 -right-2 bg-[#FB923C] text-black text-xs rounded-full px-1 font-bold">
                3
              </span>
            </NavLink>
            <NavLink to="/account" className="group">
              <User className="w-6 h-6 text-white group-hover:text-[#00B5D8] transition duration-300" />
            </NavLink>
            <NavLink
              to="/login"
              className="px-4 py-2 bg-[#FB923C] text-black rounded-lg font-medium hover:bg-[#F97316] transition duration-300 shadow"
            >
              <div className="flex items-center gap-1">
                <LogIn size={18} /> Login
              </div>
            </NavLink>
            <NavLink
              to="/register"
              className="px-4 py-2 bg-[#00B5D8] text-white rounded-lg font-medium hover:bg-[#008FA3] transition duration-300 shadow"
            >
              <div className="flex items-center gap-1">
                <UserPlus size={18} /> Register
              </div>
            </NavLink>
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B5D8] shadow-sm"
          />
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
          </NavLink>
          <NavLink
            to="/account"
            className="flex items-center text-gray-700 hover:text-[#00B5D8] transition duration-300"
          >
            <User className="w-5 h-5 mr-2" /> Account
          </NavLink>
          <NavLink
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-[#FB923C] text-black rounded-lg font-medium hover:bg-[#F97316] transition duration-300 shadow"
          >
            <LogIn size={18} /> Login
          </NavLink>
          <NavLink
            to="/register"
            className="flex items-center gap-2 px-4 py-2 bg-[#00B5D8] text-white rounded-lg font-medium hover:bg-[#008FA3] transition duration-300 shadow"
          >
            <UserPlus size={18} /> Register
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
