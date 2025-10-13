import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './components/Welcome';
import Login from './components/student/Login';
import Register from './components/student/Register';

import StudentDashboard from './components/student/StudentDashboard';
import StudentMonitoring from './components/student/Monitoring';
import StudentRating from './components/student/Rating';

import LecturerDashboard from './components/lecturer/LecturerDashboard';
import LecturerClasses from './components/lecturer/Classes';
import LecturerReports from './components/lecturer/Reports';
import LecturerMonitoring from './components/lecturer/Monitoring';
import LecturerRating from './components/lecturer/Rating';

import PRLDashboard from './components/prl/PRLDashboard';
import PRLCourses from './components/prl/Courses';
import PRLReports from './components/prl/Reports';
import PRLMonitoring from './components/prl/Monitoring';
import PRLRating from './components/prl/Rating';
import PRLClasses from './components/prl/Classes';

import PLDashboard from './components/pl/PLDashboard';
import PLCourses from './components/pl/Courses';
import PLReports from './components/pl/Reports';
import PLMonitoring from './components/pl/Monitoring';
import PLClasses from './components/pl/Classes';
import PLLectures from './components/pl/Lectures';
import PLRating from './components/pl/Rating';

import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes - Redirect to dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Navigate to="/student/dashboard/monitoring" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Lecturer routes - Redirect to dashboard */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <Navigate to="/lecturer/dashboard/classes" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />

        {/* PRL routes - Redirect to dashboard */}
        <Route
          path="/prl"
          element={
            <ProtectedRoute allowedRoles={['prl']}>
              <Navigate to="/prl/dashboard/courses" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prl/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['prl']}>
              <PRLDashboard />
            </ProtectedRoute>
          }
        />

        {/* PL routes - Redirect to dashboard */}
        <Route
          path="/pl"
          element={
            <ProtectedRoute allowedRoles={['pl']}>
              <Navigate to="/pl/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pl/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['pl']}>
              <PLDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;