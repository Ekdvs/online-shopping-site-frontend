// pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-6 md:px-20 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          About Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Welcome to Our Online Store! We are committed to providing you with the best shopping experience with quality products, fast delivery, and exceptional customer service.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto py-16 px-6 md:px-0 space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center md:text-left">
          Our Story
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed text-center md:text-left">
          Our journey started with a simple idea: to make online shopping easier, faster, and more enjoyable for everyone. We source high-quality products from trusted suppliers and ensure that every order reaches our customers on time.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-0 grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-700">
              To deliver high-quality products with exceptional customer service, making online shopping a delightful experience for all.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-gray-700">
              To be the most trusted and convenient online store in Sri Lanka, offering an extensive range of products at competitive prices.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto py-16 px-6 md:px-0">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Vishwa Sampath", role: "Founder & CEO", image: "https://via.placeholder.com/300" },
            { name: "Jane Doe", role: "Marketing Head", image: "https://via.placeholder.com/300" },
            { name: "John Smith", role: "Lead Developer", image: "https://via.placeholder.com/300" },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h4 className="text-xl font-bold">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Call-to-Action */}
      <div className="bg-blue-600 text-white py-12 px-6 md:px-20 text-center md:text-left rounded-t-lg mt-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Connected</h2>
        <p className="mb-4 max-w-xl">
          Sign up for our newsletter to get updates on new products, offers, and more.
        </p>
        <Link to='/register'>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition">
            Subscribe Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
