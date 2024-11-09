import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
                <p className="text-gray-600 mb-6">
                    {error.statusText || error.message || "The page you're looking for doesn't exist."}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;