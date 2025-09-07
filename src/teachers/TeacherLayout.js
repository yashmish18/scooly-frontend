import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TeacherProvider } from './context/TeacherContext';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Gradebook from './pages/Gradebook';
import Attendance from './pages/Attendance';
import Materials from './pages/Materials';
import Settings from './pages/Settings';
import Students from './pages/Students'; // Create this if missing
import TeacherShell from './components/TeacherShell';
import Mail from './pages/Mail';
import Schedule from './pages/Schedule';


const queryClient = new QueryClient();

export default function TeacherLayout() {
  const location = useLocation();
  // Determine active navigation based on current path
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/teacher' || path === '/teacher/') return 'Dashboard';
    if (path.includes('/materials')) return 'My Courses';
    if (path.includes('/assignments')) return 'Assignments';
    if (path.includes('/gradebook')) return 'Grades';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/attendance')) return 'Attendance';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/mail') || path.includes('/inbox')) return 'Inbox';
    if (path.includes('/schedule')) return 'Schedule';

    return 'Dashboard';
  };
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherProvider>
        <TeacherShell active={getActiveNav()}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="students" element={<Students />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="settings" element={<Settings />} />
            <Route path="mail" element={<Mail />} />
            <Route path="inbox" element={<Mail />} />
            <Route path="schedule" element={<Schedule />} />

          </Routes>
        </TeacherShell>
      </TeacherProvider>
    </QueryClientProvider>
  );
} 