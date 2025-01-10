import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '../src/components/auth/AuthContext';
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register';
import HomePage from './components/HomePage';
import FoldersPage from './components/FoldersPage';
import SectionPage from './components/SectionPage';
import ExercisePage from './components/ExercisePage';
import ErrorPage from './components/ErrorPage';
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/protectedRoute';
import ForgetPassword from './components/auth/ForgetPassword';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgetPassword />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />
  },

  {
    path: '/Home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/folders',
    element: (
      <ProtectedRoute>
        <FoldersPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/folders/:folderId/sections',
    element: (
      <ProtectedRoute>
        <SectionPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/folders/:folderId/sections/:sectionId/exercises',
    element: (
      <ProtectedRoute>
        <ExercisePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/folder',
    element: <Navigate to="/folders" replace />
  },
  {
    path: '/',
    element: <Navigate to="/Home" replace />
  },
  {
    path: '*',
    element: <Navigate to="/Home" replace />
  }
]);

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;