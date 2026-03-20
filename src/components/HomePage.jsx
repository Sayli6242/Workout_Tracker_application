import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderOpen, Calendar, Activity, ArrowRight,
    Flame, Trophy, Dumbbell, TrendingUp, Plus
} from 'lucide-react';
import axios from '../lib/axiosConfig';
import { useAuth } from '../components/auth/AuthContext';
import Navbar from './Navbar';

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [folders, setFolders] = useState([]);
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get('/folders/').catch(() => ({ data: [] })),
            axios.get('/workout-logs/').catch(() => ({ data: [] })),
        ]).then(([fRes, wRes]) => {
            setFolders(fRes.data);
            setWorkoutLogs(wRes.data);
            setLoading(false);
        });
    }, []);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const todayStr = new Date().toISOString().substring(0, 10);

    const thisWeekCount = (() => {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return workoutLogs.filter(l => l.logged_date >= weekAgo.toISOString().substring(0, 10)).length;
    })();

    const streak = (() => {
        const dates = [...new Set(workoutLogs.map(l => l.logged_date))].sort().reverse();
        let count = 0;
        let current = new Date();
        for (const d of dates) {
            const diff = Math.round((current - new Date(d)) / 86400000);
            if (diff <= 1) { count++; current = new Date(d); }
            else break;
        }
        return count;
    })();

    const workedToday = workoutLogs.some(l => l.logged_date === todayStr);

    const folderColors = [
        'from-purple-500 to-violet-600',
        'from-pink-500 to-rose-600',
        'from-blue-500 to-cyan-600',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-amber-600',
        'from-fuchsia-500 to-purple-600',
    ];

    const stats = [
        { label: 'This Week', value: thisWeekCount, unit: 'workouts', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
        { label: 'Streak', value: streak, unit: 'days', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Folders', value: folders.length, unit: 'total', icon: <FolderOpen className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Today', value: workedToday ? '✓' : '—', unit: workedToday ? 'done' : 'rest', icon: <Trophy className="w-5 h-5" />, color: workedToday ? 'text-yellow-400' : 'text-gray-500', bg: workedToday ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/5 border-white/10' },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 pb-16 lg:pt-0 lg:pb-0">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <p className="text-gray-500 text-sm mb-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-3xl font-bold text-white">
                        {greeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
                    </h1>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    {stats.map(({ label, value, unit, icon, color, bg }) => (
                        <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                            <div className={`flex items-center gap-2 ${color} mb-2`}>
                                {icon}
                                <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="text-2xl font-bold text-white leading-none">
                                {value}
                                <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    <button
                        onClick={() => navigate('/calendar')}
                        className="flex items-center gap-3 p-4 bg-[#1a1a2e] border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-[#1e1e35] transition-all group"
                    >
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-medium text-sm">Calendar</p>
                            <p className="text-gray-500 text-xs">Track workout days</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/measurements')}
                        className="flex items-center gap-3 p-4 bg-[#1a1a2e] border border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-[#1e1e35] transition-all group"
                    >
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-medium text-sm">Measurements</p>
                            <p className="text-gray-500 text-xs">Body stats</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/workouts')}
                        className="flex items-center gap-3 p-4 bg-[#1a1a2e] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all group col-span-2 sm:col-span-1"
                    >
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-medium text-sm">Workouts</p>
                            <p className="text-gray-500 text-xs">Manage workouts</p>
                        </div>
                    </button>
                </div>

                {/* Folders quick-access */}
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Your Workouts</h2>
                    {folders.length > 4 && (
                        <button onClick={() => navigate('/workouts')} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : folders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-[#1a1a2e] border border-white/5 rounded-2xl text-center">
                        <Dumbbell className="w-10 h-10 text-gray-700 mb-3" />
                        <p className="text-gray-400 mb-4">No workouts yet. Create one to get started.</p>
                        <button
                            onClick={() => navigate('/workouts')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium text-sm shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Create Workout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {folders.slice(0, 8).map((folder, idx) => {
                            const grad = folderColors[idx % folderColors.length];
                            return (
                                <button
                                    key={folder.id}
                                    onClick={() => navigate(`/workouts/${folder.id}`)}
                                    className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-4 text-left hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all duration-200 relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${grad}`} />
                                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${grad} mb-3 shadow-sm`}>
                                        <FolderOpen className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-white font-medium text-sm leading-snug line-clamp-2">{folder.name}</p>
                                    <p className="text-gray-600 text-xs mt-1 flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                                        Open <ArrowRight className="w-3 h-3" />
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
