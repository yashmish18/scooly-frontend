import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ToastProvider } from './components/ui/ToastProvider';
import RequireAuth from './features/auth/RequireAuth';
import RoleRedirect from './components/RoleRedirect';
import NotFoundPage from './components/NotFoundPage';
import LoginPage from './features/auth/LoginPage';
import AdminLayout from './admin/AdminLayout';
import StudentLayout from './students/StudentLayout';
import TeacherLayout from './teachers/TeacherLayout';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes with role-based access */}
            <Route
              path="/admin/*"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <AdminLayout />
                </RequireAuth>
              }
            />
            
            <Route
              path="/student/*"
              element={
                <RequireAuth allowedRoles={['student']}>
                  <StudentLayout />
                </RequireAuth>
              }
            />
            
            <Route
              path="/teacher/*"
              element={
                <RequireAuth allowedRoles={['teacher']}>
                  <TeacherLayout />
                </RequireAuth>
              }
            />
            
            {/* Root redirect based on user role */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <RoleRedirect />
                </RequireAuth>
              }
            />
            
            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
