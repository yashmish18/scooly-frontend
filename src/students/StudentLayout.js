import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudentProvider } from './context/StudentContext';
import StudentSidebar from './components/StudentSidebar';
import StudentTopNav from './components/StudentTopNav';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import SubjectDetails from './pages/SubjectDetails';
import Assignments from './pages/Assignments';
import Gradebook from './pages/Gradebook';
import Attendance from './pages/Attendance';
import Mail from './pages/Mail';
import DraftMail from './pages/DraftMail';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function StudentDashboardShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <StudentTopNav />
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function StudentLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentProvider>
        <Routes>
          <Route element={<StudentDashboardShell />}>
            <Route index element={<Dashboard />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="subjects" element={<SubjectDetails />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="grades" element={<Gradebook />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="documents" element={<Documents />} />
            <Route path="mail" element={<Mail />} />
            <Route path="mail/draft" element={<DraftMail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </StudentProvider>
    </QueryClientProvider>
  );
} 