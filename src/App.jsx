import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '../src/components/auth/AuthContext';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import HomePage from './components/HomePage';
import WorkoutsPage from './components/WorkoutsPage';
import WorkoutDetailPage from './components/WorkoutDetailPage';
import HistoryPage from './components/HistoryPage';
import CalendarPage from './components/CalendarPage';
import MeasurementsPage from './components/MeasurementsPage';
import ErrorPage from './components/ErrorPage';
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/protectedRoute';
import ForgetPassword from './components/auth/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmailPage from './components/auth/VerifyEmailPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/forgot-password',
    element: <PublicRoute><ForgetPassword /></PublicRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/reset-password',
    element: <ProtectedRoute><ResetPassword /></ProtectedRoute>
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/Home',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/workouts',
    element: <ProtectedRoute><WorkoutsPage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/workouts/:workoutId',
    element: <ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/history',
    element: <ProtectedRoute><HistoryPage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/calendar',
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: '/measurements',
    element: <ProtectedRoute><MeasurementsPage /></ProtectedRoute>,
    errorElement: <ErrorPage />
  },
  // Legacy redirects
  { path: '/folders', element: <Navigate to="/workouts" replace /> },
  { path: '/folder', element: <Navigate to="/workouts" replace /> },
  { path: '/', element: <Navigate to="/Home" replace /> },
  { path: '*', element: <Navigate to="/Home" replace /> }
]);

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-[#0d0d17]">
      <RouterProvider router={router} />
    </div>
  </AuthProvider>
);

export default App;
