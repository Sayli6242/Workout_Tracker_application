import React from 'react';
import { FolderPlus, Dumbbell, Target, Trophy, Flame, Calendar, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Organize Workouts',
            desc: 'Group exercises into folders and sections to keep your routine structured.',
            color: 'from-purple-500 to-violet-600',
        },
        {
            icon: <Flame className="w-6 h-6" />,
            title: 'Log Every Set',
            desc: 'Record sets, reps and weight for each exercise and watch your PRs climb.',
            color: 'from-orange-500 to-pink-500',
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: 'Personal Records',
            desc: 'Automatically track your best lift for every exercise.',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: 'Workout Calendar',
            desc: 'Visualise your training consistency with a day-by-day calendar.',
            color: 'from-green-500 to-teal-500',
        },
        {
            icon: <Activity className="w-6 h-6" />,
            title: 'Body Measurements',
            desc: 'Track weight, body fat and body measurements over time.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Dumbbell className="w-6 h-6" />,
            title: 'Progress Charts',
            desc: 'See weight and volume trends for any exercise with clean line charts.',
            color: 'from-fuchsia-500 to-purple-600',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white">
            {/* Glow blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 py-20">
                {/* Hero */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                        <Dumbbell className="w-4 h-4" />
                        Your personal fitness companion
                    </div>

                    <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-none">
                        Train smarter.
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                            Progress faster.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-xl max-w-xl mx-auto mb-10">
                        Log workouts, track personal records, measure your body and visualise every rep of your journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/folders')}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200"
                        >
                            <FolderPlus className="w-5 h-5" />
                            Open Folders
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/calendar')}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 transition-all duration-200"
                        >
                            <Calendar className="w-5 h-5" />
                            View Calendar
                        </button>
                    </div>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map(({ icon, title, desc, color }) => (
                        <div
                            key={title}
                            className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all duration-300"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-4 shadow-lg`}>
                                {icon}
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
