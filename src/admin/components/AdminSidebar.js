import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaClipboardList, FaBook, FaCog, FaSignOutAlt, FaUsers, FaUserPlus, FaUpload, FaEnvelope, FaChalkboardTeacher, FaUserTie, FaLayerGroup } from 'react-icons/fa';
import { useAuth } from '../../features/auth/AuthContext';

export default function AdminSidebar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 w-64 bg-white border-r border-gray-100 flex flex-col p-6 min-h-screen">
      {/* Welcome message at the top */}
      <div className="mb-8">
        <div className="font-semibold text-gray-900 text-lg">Welcome, {user?.name || 'Admin'}!</div>
        <div className="text-xs text-gray-500">Role: {user?.role || 'Admin'}</div>
      </div>
      <nav className="flex-1">
        {/* Main Dashboard/Applicants/Courses */}
        <div className="mb-4 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Dashboard' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Dashboard' ? 600 : 400 }}
          >
            <FaHome className="text-lg" />
            Dashboard
          </Link>
          <Link
            to="/admin/applicants"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Applicants' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Applicants' ? 600 : 400 }}
          >
            <FaUserGraduate className="text-lg" />
            Applicants
          </Link>
          <Link
            to="/admin/admissions"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Admissions' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Admissions' ? 600 : 400 }}
          >
            <FaClipboardList className="text-lg" />
            Admissions
          </Link>
          <Link
            to="/admin/courses"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Courses' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Courses' ? 600 : 400 }}
          >
            <FaBook className="text-lg" />
            Courses
          </Link>
          <Link
            to="/admin/bulk-upload-courses"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Bulk Upload Courses' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Bulk Upload Courses' ? 600 : 400 }}
          >
            <FaUpload className="text-lg" />
            Bulk Upload Courses
          </Link>
          <Link
            to="/admin/mail"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Mail' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
            style={{ fontWeight: active === 'Mail' ? 600 : 400 }}
          >
            <FaEnvelope className="text-lg" />
            Mail
          </Link>
        </div>
        {/* Student Section */}
        <div className="mb-2 mt-6">
          <div className="uppercase text-xs text-gray-400 font-bold tracking-wider mb-2 pl-1">Students</div>
          <div className="space-y-1">
            <Link to="/admin/students" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Students' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaUsers className="text-lg" />Student List</Link>
            <Link to="/admin/add-student" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Add Student' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaUserPlus className="text-lg" />Add Student</Link>
            <Link to="/admin/bulk-upload" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Bulk Upload' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaUpload className="text-lg" />Bulk Upload</Link>
            <Link to="/admin/student-controls" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Student Controls' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaCog className="text-lg" />Student Controls</Link>
          </div>
        </div>
        {/* Teacher Section */}
        <div className="mb-2 mt-6">
          <div className="uppercase text-xs text-gray-400 font-bold tracking-wider mb-2 pl-1">Teachers</div>
          <div className="space-y-1">
            <Link to="/admin/teachers" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Teachers' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaChalkboardTeacher className="text-lg" />Teacher List</Link>
            <Link to="/admin/add-teacher" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Add Teacher' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaUserTie className="text-lg" />Add Teacher</Link>
            <Link to="/admin/bulk-upload-teachers" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Bulk Upload Teachers' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaUpload className="text-lg" />Bulk Upload Teachers</Link>
            <Link to="/admin/teacher-controls" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Teacher Controls' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaCog className="text-lg" />Teacher Controls</Link>
            <Link to="/admin/teacher-dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md ${active === 'Teacher Dashboard' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}><FaLayerGroup className="text-lg" />Teacher Dashboard</Link>
          </div>
        </div>
      </nav>
      {/* Settings at the bottom */}
      <div className="mt-auto pt-8 border-t flex flex-col gap-2">
        <Link
          to="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 text-md ${active === 'Settings' ? 'bg-blue-100 text-blue-900 font-bold' : ''}`}
          style={{ fontWeight: active === 'Settings' ? 600 : 400 }}
        >
          <FaCog className="text-lg" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-700 hover:bg-red-100 transition text-md font-semibold"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
} 