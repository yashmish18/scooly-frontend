import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome, FaUserGraduate, FaClipboardList, FaBook, FaCog, FaSignOutAlt, FaUsers,
  FaUserPlus, FaUpload, FaEnvelope, FaChalkboardTeacher, FaUserTie, FaLayerGroup
} from 'react-icons/fa';
import { useAuth } from '../../features/auth/AuthContext';

const mainLinks = [
  { to: '/admin', icon: FaHome, label: 'Dashboard' },
  { to: '/admin/applicants', icon: FaUserGraduate, label: 'Applicants' },
  { to: '/admin/admissions', icon: FaClipboardList, label: 'Admissions' },
  { to: '/admin/courses', icon: FaBook, label: 'Courses' },
  { to: '/admin/bulk-upload-courses', icon: FaUpload, label: 'Bulk Upload Courses' },
  { to: '/admin/mail', icon: FaEnvelope, label: 'Mail' },
];

const studentLinks = [
  { to: '/admin/students', icon: FaUsers, label: 'Student List' },
  { to: '/admin/add-student', icon: FaUserPlus, label: 'Add Student' },
  { to: '/admin/bulk-upload', icon: FaUpload, label: 'Bulk Upload' },
  { to: '/admin/student-controls', icon: FaCog, label: 'Student Controls' },
];

const teacherLinks = [
  { to: '/admin/teachers', icon: FaChalkboardTeacher, label: 'Teacher List' },
  { to: '/admin/add-teacher', icon: FaUserTie, label: 'Add Teacher' },
  { to: '/admin/bulk-upload-teachers', icon: FaUpload, label: 'Bulk Upload Teachers' },
  { to: '/admin/teacher-controls', icon: FaCog, label: 'Teacher Controls' },
  { to: '/admin/teacher-dashboard', icon: FaLayerGroup, label: 'Teacher Dashboard' },
];

const NavLink = ({ to, icon: Icon, label, active }) => {
  const isActive = active === label;
  const activeClasses = 'bg-blue-100 text-blue-900 font-bold';
  const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-blue-50 text-md';

  return (
    <Link to={to} className={`${baseClasses} ${isActive ? activeClasses : ''}`}>
      <Icon className="text-lg" />
      {label}
    </Link>
  );
};

const NavSection = ({ title, links, active }) => (
  <div className="mb-2 mt-6">
    <div className="uppercase text-xs text-gray-400 font-bold tracking-wider mb-2 pl-1">{title}</div>
    <div className="space-y-1">
      {links.map(link => <NavLink key={link.to} {...link} active={active} />)}
    </div>
  </div>
);

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
          {mainLinks.map(link => <NavLink key={link.to} {...link} active={active} />)}
        </div>
        {/* Student Section */}
        <NavSection title="Students" links={studentLinks} active={active} />
        {/* Teacher Section */}
        <NavSection title="Teachers" links={teacherLinks} active={active} />
      </nav>
      {/* Settings at the bottom */}
      <div className="mt-auto pt-8 border-t flex flex-col gap-2">
        <NavLink to="/admin/settings" icon={FaCog} label="Settings" active={active} />
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