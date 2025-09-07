import React from 'react';

export default function TopNav() {
  return (
    <header className="w-full bg-white border-b border-gray-100 flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-sm inline-block" /> Admissions Hub
        </span>
        <nav className="ml-8 flex gap-6 text-sm text-gray-700">
          <a href="/" className="hover:text-accent">Dashboard</a>
          <a href="#" className="hover:text-accent">Applicants</a>
          <a href="#" className="hover:text-accent">Decisions</a>
          <a href="#" className="hover:text-accent">Reports</a>
          <a href="#" className="hover:text-accent">Settings</a>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <span className="material-icons text-gray-400 text-2xl">notifications_none</span>
        </button>
        <div className="w-9 h-9 rounded-full bg-pastelBlue flex items-center justify-center overflow-hidden border border-gray-200">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
} 