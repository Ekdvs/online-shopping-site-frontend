import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1E3A8A] via-[#00B5D8] to-[#8B5CF6] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">ShopEase</h2>
          <p className="text-gray-200">
            Your one-stop destination for all your shopping needs. Quality
            products, best prices, and fast delivery.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-[#FB923C] transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-[#FB923C] transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-[#FB923C] transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-[#FB923C] transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "Shop", "About Us", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`/${link.replace(/\s+/g, "").toLowerCase()}`}
                  className="hover:text-[#00B5D8] transition"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
          <ul className="space-y-2">
            {["FAQ", "Shipping & Returns", "Privacy Policy", "Terms & Conditions"].map((item) => (
              <li key={item}>
                <a
                  href={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                  className="hover:text-[#00B5D8] transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
          <p className="text-gray-200 mb-3">
            Get updates about new products and special offers.
          </p>
          <div className="flex items-center bg-white rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full text-gray-700 focus:outline-none"
            />
            <button className="bg-[#00B5D8] text-white px-4 py-2 hover:bg-[#008FA3] transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-8 py-4 text-center text-gray-200 text-sm">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
