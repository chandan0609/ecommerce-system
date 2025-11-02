// src/components/common/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-white shadow p-4 flex gap-6">
      <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">
        Dashboard
      </Link>
      <Link to="/products" className="text-gray-700 font-medium hover:text-blue-600">
        Products
      </Link>
    </nav>
    <div className="p-6">{children}</div>
  </div>
);

export default Layout;
