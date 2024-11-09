import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Workout Planner</h1>
                <p className="text-gray-600 mb-8">
                    Organize your workouts by creating folders and sections
                </p>
                <button
                    onClick={() => navigate('/folders')}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <FolderPlus className="w-5 h-5 mr-2" />
                    Create Folders
                </button>
            </div>
        </div>
    );
};

export default HomePage;