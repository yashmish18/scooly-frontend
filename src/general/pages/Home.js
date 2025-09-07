import React from 'react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Scooly</h1>
        <p className="text-xl text-gray-600 mb-8">Your comprehensive school management system</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-2">For Students</h3>
            <p className="text-gray-600">Track your academic progress, view grades, and manage your courses.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-bold mb-2">For Teachers</h3>
            <p className="text-gray-600">Manage courses, grade assignments, and interact with students.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold mb-2">For Administrators</h3>
            <p className="text-gray-600">Oversee admissions, manage users, and maintain system operations.</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6">
            Choose your role to access the appropriate dashboard and features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Student Login
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Teacher Login
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 