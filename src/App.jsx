import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './components/HomePage';
import FoldersPage from './components/FoldersPage';
import SectionPage from './components/SectionPage';
import ExercisePage from './components/ExercisePage';
import ErrorPage from './components/ErrorPage';

axios.defaults.baseURL = 'http://localhost:8000';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/folders',
    element: <FoldersPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/folders/:folderId/sections',
    element: <SectionPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/folders/:folderId/sections/:sectionId/exercises',
    element: <ExercisePage />,
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
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;