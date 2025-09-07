import React from 'react';
import { FaBell } from 'react-icons/fa';

export default function StudentTopNav() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-sm inline-block" /> Scooly
          </span>
          <span className="text-gray-500 text-lg">Student Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <FaBell className="text-gray-600 text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
} 