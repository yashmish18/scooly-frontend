import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome, FaCalendarAlt, FaBook, FaClipboardList, FaChartBar, FaUserCheck, FaEnvelope, FaFolderOpen, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../features/auth/AuthContext';
import { useStudent } from '../context/StudentContext';

const navLinks = [
  { label: 'Dashboard', to: '/student', icon: <FaHome /> },
  { label: 'Timetable', to: '/student/timetable', icon: <FaCalendarAlt /> },
  { label: 'Subjects', to: '/student/subjects', icon: <FaBook /> },
  { label: 'Assignments', to: '/student/assignments', icon: <FaClipboardList /> },
  { label: 'Grades', to: '/student/grades', icon: <FaChartBar /> },
  { label: 'Attendance', to: '/student/attendance', icon: <FaUserCheck /> },
  { label: 'Documents', to: '/student/documents', icon: <FaFolderOpen /> },
  { label: 'Mail', to: '/student/mail', icon: <FaEnvelope /> },
];

export default function StudentSidebar({ active }) {
  const { logout } = useAuth();
  const { student } = useStudent() || {};
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <aside className="sticky top-0 w-64 bg-white border-r border-gray-100 flex flex-col p-6 min-h-screen">
      <div className="mb-8">
        <div className="font-semibold text-gray-900 text-lg">Welcome{student?.firstName ? ',' : ''} {student?.firstName || ''} {student?.lastName || ''}</div>
        <div className="text-xs text-gray-500">Student</div>
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
          to="/student/settings"
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