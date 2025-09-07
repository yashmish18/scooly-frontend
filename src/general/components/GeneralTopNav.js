import React from 'react';
import { Link } from 'react-router-dom';

export default function GeneralTopNav() {
  return (
    <header className="bg-white border-b border-gray-100 px-10 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-sm inline-block" /> Scooly
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Login
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
} 