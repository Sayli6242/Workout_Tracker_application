import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from '../src/components/auth/AuthContext';  // Import both AuthProvider and useAuth
import Login from '../src/components/auth/Login';
import Register from '../src/components/auth/Register'
import HomePage from './components/HomePage';
import FoldersPage from './components/FoldersPage';
import SectionPage from './components/SectionPage';
import ExercisePage from './components/ExercisePage';
import ErrorPage from './components/ErrorPage';

// Create a protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <Register />,
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
    path: '*',
    element: <Navigate to="/" replace />
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