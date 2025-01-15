import React from 'react';
import { FolderPlus, Dumbbell, Target, Trophy, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDF5F3]">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-4 top-1/4 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -right-4 top-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute left-1/4 bottom-1/4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
                {/* Hero Section */}
                <div className="w-full max-w-4xl mx-auto text-center space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-400 rounded-full blur-lg opacity-75" />
                            <div className="relative bg-white p-4 rounded-full">
                                <Dumbbell className="w-16 h-16 text-fuchsia-600" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        <h1 className="text-6xl font-extrabold text-gray-800">
                            Workout
                            <span className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-transparent bg-clip-text"> Planner</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Elevate your fitness journey with a personalized workout plan
                        </p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-white p-6 rounded-xl border border-pink-100 hover:border-fuchsia-500 transition-all duration-300 shadow-sm hover:shadow-md">
                                <Target className="w-8 h-8 text-fuchsia-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Set Goals</h3>
                                <p className="text-gray-600">Define your fitness objectives and track your progress by yourself</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-pink-100 hover:border-fuchsia-500 transition-all duration-300 shadow-sm hover:shadow-md">
                                <Flame className="w-8 h-8 text-pink-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Stay Motivated</h3>
                                <p className="text-gray-600">Modify your folders to keep your workout routine fresh and engaging</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-pink-100 hover:border-fuchsia-500 transition-all duration-300 shadow-sm hover:shadow-md">
                                <Trophy className="w-8 h-8 text-orange-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Make Progress</h3>
                                <p className="text-gray-600">Create personalized exercises to achive your fitness goals</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-12">
                            <button
                                onClick={() => navigate('/folders')}
                                className="group relative inline-flex items-center px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-pink-500 top-1/2 group-hover:h-64 -translate-y-32 ease" />
                                <span className="relative flex items-center space-x-2">
                                    <FolderPlus className="w-6 h-6" />
                                    <span className="font-semibold text-lg">Get Started Now</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
