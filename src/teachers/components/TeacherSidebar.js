import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaClipboardList, FaChartBar, FaCalendarAlt, FaEnvelope, FaCog, FaSignOutAlt, FaUsers, FaUserPlus, FaPlusSquare, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../features/auth/AuthContext';

const user = {
  name: 'Dr. Sarah Johnson',
  role: 'Professor',
  avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
};

const navLinks = [
  { label: 'Dashboard', icon: <FaHome />, to: '/teacher' },
  { label: 'My Courses', icon: <FaBook />, to: '/teacher/materials' },
  { label: 'Assignments', icon: <FaClipboardList />, to: '/teacher/assignments' },
  { label: 'Grades', icon: <FaChartBar />, to: '/teacher/gradebook' },
  { label: 'Students', icon: <FaUsers />, to: '/teacher/students' },
  { label: 'Attendance', icon: <FaUserCheck />, to: '/teacher/attendance' },
  { label: 'Schedule', icon: <FaCalendarAlt />, to: '/teacher/schedule' },
  { label: 'Mail', icon: <FaEnvelope />, to: '/teacher/mail' },
];

export default function TeacherSidebar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <aside className="sticky top-0 w-64 bg-white border-r border-gray-100 flex flex-col p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="font-semibold text-gray-900 text-lg">
          {user?.name || 'Teacher'}
        </div>
      </div>
      <nav className="flex-1">
        {navLinks.map(link => (
          <Link
            key={link.label}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 text-gray-700 hover:bg-blue-50 transition text-md ${active === link.label ? 'bg-blue-100 font-semibold text-blue-900' : ''}`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t flex flex-col gap-2">
        <Link
          to="/teacher/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition text-md ${active === 'Settings' ? 'bg-blue-100 font-semibold text-blue-900' : ''}`}
        >
          <FaCog className="text-lg" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-700 hover:bg-red-100 transition text-md font-semibold"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
} 