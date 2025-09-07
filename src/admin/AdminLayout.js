import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminShell from './components/AdminShell';
import Dashboard from './pages/Dashboard';
import Applicants from './pages/Applicants';
import AddStudent from './pages/AddStudent';
import BulkUpload from './pages/BulkUpload';
import ApplicantProfile from './pages/ApplicantProfile';
import StudentsList from './pages/StudentsList';
import EnrollStudent from './pages/EnrollStudent';
import Admissions from './pages/Admissions';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import StudentControls from './pages/StudentControls';
import TeachersList from './pages/TeachersList';
import AddTeacher from './pages/AddTeacher';
import BulkUploadTeachers from './pages/BulkUploadTeachers';
import TeacherControls from './pages/TeacherControls';
import TeacherDashboard from './pages/TeacherDashboard';
import Mail from './pages/Mail';
import DraftMail from './pages/DraftMail';
import BulkUploadCourses from './pages/BulkUploadCourses';

export default function AdminLayout() {
  const location = useLocation();
  
  // Determine active navigation based on current path
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/') return 'Dashboard';
    if (path.includes('/applicants')) return 'Applicants';
    if (path.includes('/admissions')) return 'Admissions';
    if (path.includes('/courses')) return 'Courses';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/add-student')) return 'Add Student';
    if (path.includes('/enroll')) return 'Add Student';
    if (path.includes('/bulk-upload')) return 'Bulk Upload';
    if (path.includes('/student-controls')) return 'Student Controls';
    if (path.includes('/teachers')) return 'Teachers';
    if (path.includes('/add-teacher')) return 'Add Teacher';
    if (path.includes('/bulk-upload-teachers')) return 'Bulk Upload Teachers';
    if (path.includes('/teacher-controls')) return 'Teacher Controls';
    if (path.includes('/teacher-dashboard')) return 'Teacher Dashboard';
    if (path.includes('/mail') || path.includes('/inbox')) return 'Inbox';
    return 'Dashboard';
  };

  return (
    <AdminShell active={getActiveNav()}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="courses" element={<Courses />} />
        <Route path="settings" element={<Settings />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="enroll" element={<EnrollStudent />} />
        <Route path="bulk-upload" element={<BulkUpload />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="student-controls" element={<StudentControls />} />
        <Route path="applicants/:id" element={<ApplicantProfile />} />
        {/* Teacher pages */}
        <Route path="teachers" element={<TeachersList />} />
        <Route path="add-teacher" element={<AddTeacher />} />
        <Route path="bulk-upload-teachers" element={<BulkUploadTeachers />} />
        <Route path="teacher-controls" element={<TeacherControls />} />
        <Route path="teacher-dashboard" element={<TeacherDashboard />} />
        {/* Mail pages */}
        <Route path="mail" element={<Mail />} />
        <Route path="inbox" element={<Mail />} />
        <Route path="mail/draft" element={<DraftMail />} />
        <Route path="bulk-upload-courses" element={<BulkUploadCourses />} />
      </Routes>
    </AdminShell>
  );
}