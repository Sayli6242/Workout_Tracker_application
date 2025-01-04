import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';
import { authStyles } from '../components/styles/constants';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-cover bg-no-repeat bg-center" style={{ backgroundImage: authStyles.backgroundImage }}>
            <div className="min-h-screen bg-gray-50 bg-opacity-10 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#FFC0CB] to-[#FF69B4]">
                        Workout Planner
                    </h1>
                    <p className="text-lg text-gray-700 mb-8 italic font-light">
                        Organize your workouts by creating folders and sections
                    </p>
                    <button
                        onClick={() => navigate('/folders')}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <FolderPlus className="w-5 h-5 mr-2" />
                        Create Folders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;