import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider, useDemo } from './context/DemoContext';
import { TopBanner } from './components/layout/TopBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { ExploreTutorsPage } from './pages/public/ExploreTutorsPage';
import { TutorPublicProfilePage } from './pages/public/TutorPublicProfilePage';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentSessionsPage } from './pages/student/StudentSessionsPage';
import { StudentCreditPage } from './pages/student/StudentCreditPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Tutor pages
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorBookingsPage } from './pages/tutor/TutorBookingsPage';
import { TutorAvailabilityPage } from './pages/tutor/TutorAvailabilityPage';
import { TutorEarningsPage } from './pages/tutor/TutorEarningsPage';
import { TutorReviewsPage } from './pages/tutor/TutorReviewsPage';
import { TutorProfilePage } from './pages/tutor/TutorProfilePage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTutorApplicationsPage } from './pages/admin/AdminTutorApplicationsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminActivityLogPage } from './pages/admin/AdminActivityLogPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Role Guard Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole: 'student' | 'tutor' | 'admin';
}> = ({ children, allowedRole }) => {
  const { currentUser, currentRole } = useDemo();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== allowedRole) {
    // If not matching role, redirect to appropriate role dashboard
    if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentRole === 'tutor') return <Navigate to="/tutor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans selection:bg-indigo-500 selection:text-white">
      <TopBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tutors" element={<ExploreTutorsPage />} />
          <Route path="/tutor/:id" element={<TutorPublicProfilePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/sessions"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentSessionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/credit"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentCreditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Tutor Routes */}
          <Route
            path="/tutor/dashboard"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/bookings"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/availability"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorAvailabilityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/earnings"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorEarningsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/reviews"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor/profile"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminTutorApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminTransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminActivityLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/moderation"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminModerationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </HashRouter>
  );
}
