import React from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AdminTopNav() {
  return (
    <header className="w-full bg-white border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4 p-6">
        <span className="font-bold text-xl flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-sm inline-block" /> Scooly
        </span>
        <span className="text-gray-500 text-lg">Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaBell className="text-gray-400 text-2xl" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white"></span>
        </button>
        <Link
          to="/admin/mail"
          className="flex items-center gap-2 px-3 py-1 rounded hover:bg-accent/10 transition"
        >
          <FaEnvelope className="text-accent" />
          Mail
        </Link>
      </div>
    </header>
  );
} 