import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '../src/components/auth/AuthContext';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import HomePage from './components/HomePage';
import WorkoutsPage from './components/WorkoutsPage';
import WorkoutDetailPage from './components/WorkoutDetailPage';
import HistoryPage from './components/HistoryPage';
import MeasurementsPage from './components/MeasurementsPage';
import ErrorPage from './components/ErrorPage';
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/protectedRoute';
import ForgetPassword from './components/auth/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmailPage from './components/auth/VerifyEmailPage';

// New pages
import TemplatesPage from './components/TemplatesPage';
import TemplateBuilderPage from './components/TemplateBuilderPage';
import ActiveWorkoutPage from './components/ActiveWorkoutPage';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import ExerciseLibraryPage from './components/ExerciseLibraryPage';

const router = createBrowserRouter([
  // ── Auth routes ──────────────────────────────────────────────────────────
  { path: '/login',           element: <PublicRoute><Login /></PublicRoute>,                  errorElement: <ErrorPage /> },
  { path: '/forgot-password', element: <PublicRoute><ForgetPassword /></PublicRoute>,          errorElement: <ErrorPage /> },
  { path: '/register',        element: <PublicRoute><Register /></PublicRoute>,                errorElement: <ErrorPage /> },
  { path: '/reset-password',  element: <ProtectedRoute><ResetPassword /></ProtectedRoute> },
  { path: '/verify-email',    element: <VerifyEmailPage />,                                   errorElement: <ErrorPage /> },

  // ── Main pages ───────────────────────────────────────────────────────────
  { path: '/Home',            element: <ProtectedRoute><HomePage /></ProtectedRoute>,          errorElement: <ErrorPage /> },
  { path: '/history',         element: <ProtectedRoute><HistoryPage /></ProtectedRoute>,       errorElement: <ErrorPage /> },

  // ── New pages ────────────────────────────────────────────────────────────
  { path: '/templates',       element: <ProtectedRoute><TemplatesPage /></ProtectedRoute>,     errorElement: <ErrorPage /> },
  { path: '/templates/new',   element: <ProtectedRoute><TemplateBuilderPage /></ProtectedRoute>,errorElement: <ErrorPage /> },
  { path: '/templates/:templateId', element: <ProtectedRoute><TemplateBuilderPage /></ProtectedRoute>, errorElement: <ErrorPage /> },
  { path: '/workout/active',  element: <ProtectedRoute><ActiveWorkoutPage /></ProtectedRoute>, errorElement: <ErrorPage /> },
  { path: '/progress',        element: <ProtectedRoute><ProgressPage /></ProtectedRoute>,      errorElement: <ErrorPage /> },
  { path: '/profile',         element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,       errorElement: <ErrorPage /> },
  { path: '/library',         element: <ProtectedRoute><ExerciseLibraryPage /></ProtectedRoute>,errorElement: <ErrorPage /> },

  // ── Legacy routes (kept for backward compat) ─────────────────────────────
  { path: '/workouts',        element: <ProtectedRoute><WorkoutsPage /></ProtectedRoute>,      errorElement: <ErrorPage /> },
  { path: '/workouts/:workoutId', element: <ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>, errorElement: <ErrorPage /> },
  { path: '/measurements',    element: <ProtectedRoute><MeasurementsPage /></ProtectedRoute>,  errorElement: <ErrorPage /> },
  { path: '/calendar',        element: <Navigate to="/history" replace /> },

  // ── Redirects ─────────────────────────────────────────────────────────────
  { path: '/folders', element: <Navigate to="/templates" replace /> },
  { path: '/folder',  element: <Navigate to="/templates" replace /> },
  { path: '/',        element: <Navigate to="/Home" replace /> },
  { path: '*',        element: <Navigate to="/Home" replace /> },
]);

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-[#0d0d17]">
      <RouterProvider router={router} />
    </div>
  </AuthProvider>
);

export default App;
