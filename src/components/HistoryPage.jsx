import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Dumbbell, ChevronDown, ChevronUp, Trash2, History, BarChart2 } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

// Get ISO week number and week range label
const getWeekKey = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
};

const getWeekRange = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay() || 7;
    const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const fmt = (dt) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(mon)} – ${fmt(sun)}`;
};

const formatDate = (str) => {
    if (!str) return '';
    return new Date(str).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const TABS = ['Day', 'Week', 'Session'];

const HistoryPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('Day');
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [expandedSession, setExpandedSession] = useState(null);
    const [sessionDetails, setSessionDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get('/workout-logs/').catch(() => ({ data: [] })),
            axios.get('/workout-sessions/').catch(() => ({ data: [] })),
        ]).then(([wRes, sRes]) => {
            setWorkoutLogs(wRes.data);
            setSessions(sRes.data);
            setLoading(false);
        });
    }, []);

    const toggleSession = async (id) => {
        if (expandedSession === id) { setExpandedSession(null); return; }
        setExpandedSession(id);
        if (!sessionDetails[id]) {
            try {
                const r = await axios.get(`/workout-sessions/${id}/`);
                setSessionDetails(prev => ({ ...prev, [id]: r.data }));
            } catch (e) { console.error(e); }
        }
    };

    const deleteSession = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`/workout-sessions/${id}/`);
            setSessions(sessions.filter(s => s.id !== id));
            if (expandedSession === id) setExpandedSession(null);
        } catch (e) { console.error(e); }
    };

    const deleteWorkoutLog = async (id) => {
        try {
            await axios.delete(`/workout-logs/${id}/`);
            setWorkoutLogs(workoutLogs.filter(l => l.id !== id));
        } catch (e) { console.error(e); }
    };

    // Group workout_logs by date
    const byDay = workoutLogs.reduce((acc, log) => {
        const d = log.logged_date || (log.created || '').substring(0, 10);
        if (!acc[d]) acc[d] = [];
        acc[d].push(log);
        return acc;
    }, {});
    const sortedDays = Object.keys(byDay).sort().reverse();

    // Group workout_logs by week
    const byWeek = workoutLogs.reduce((acc, log) => {
        const d = log.logged_date || (log.created || '').substring(0, 10);
        const key = getWeekKey(d);
        if (!acc[key]) acc[key] = { range: getWeekRange(d), logs: [] };
        acc[key].logs.push(log);
        return acc;
    }, {});
    const sortedWeeks = Object.keys(byWeek).sort().reverse();

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 pb-16 lg:pt-0 lg:pb-0">
            <Navbar />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <History className="w-7 h-7 text-purple-400" />
                        Workout History
                    </h1>
                    <p className="text-gray-500 mt-1">{workoutLogs.length} logged workout{workoutLogs.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)}
                    </div>
                ) : (
                    <>
                        {/* DAY TAB */}
                        {tab === 'Day' && (
                            sortedDays.length === 0 ? (
                                <EmptyState icon={<CalendarDays className="w-10 h-10 text-gray-700" />} text="No workout history yet" sub="Log workouts from the Calendar page" />
                            ) : (
                                <div className="space-y-6">
                                    {sortedDays.map(day => (
                                        <div key={day}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <CalendarDays className="w-4 h-4 text-purple-400" />
                                                <h3 className="text-sm font-semibold text-gray-300">{formatDate(day)}</h3>
                                                <span className="text-xs text-gray-600 ml-1">({byDay[day].length} workout{byDay[day].length !== 1 ? 's' : ''})</span>
                                            </div>
                                            <div className="space-y-2 pl-6">
                                                {byDay[day].map(log => (
                                                    <div key={log.id} className="flex items-center justify-between bg-[#1a1a2e] border border-white/5 rounded-xl px-4 py-3 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                            <span className="text-white font-medium text-sm">{log.folder_name}</span>
                                                            {log.notes && <span className="text-gray-500 text-xs">— {log.notes}</span>}
                                                        </div>
                                                        <button onClick={() => deleteWorkoutLog(log.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {/* WEEK TAB */}
                        {tab === 'Week' && (
                            sortedWeeks.length === 0 ? (
                                <EmptyState icon={<BarChart2 className="w-10 h-10 text-gray-700" />} text="No workout history yet" sub="Log workouts to see weekly summaries" />
                            ) : (
                                <div className="space-y-4">
                                    {sortedWeeks.map(wk => {
                                        const { range, logs } = byWeek[wk];
                                        return (
                                            <div key={wk} className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden">
                                                <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                                <div className="p-5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <p className="text-white font-semibold">{range}</p>
                                                            <p className="text-gray-500 text-xs mt-0.5">{logs.length} workout session{logs.length !== 1 ? 's' : ''}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                            <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                                                            <span className="text-purple-300 text-sm font-medium">{logs.length}×</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[...new Set(logs.map(l => l.folder_name))].map(name => (
                                                            <span key={name} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs">{name}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}

                        {/* SESSION TAB */}
                        {tab === 'Session' && (
                            sessions.length === 0 ? (
                                <EmptyState icon={<Clock className="w-10 h-10 text-gray-700" />} text="No sessions recorded" sub="Sessions are created when you start a workout" />
                            ) : (
                                <div className="space-y-3">
                                    {sessions.map(session => {
                                        const isOpen = expandedSession === session.id;
                                        const detail = sessionDetails[session.id];
                                        return (
                                            <div key={session.id} className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden">
                                                <div className="h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                                                <div
                                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/2 transition-colors"
                                                    onClick={() => toggleSession(session.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-xl bg-purple-600/20">
                                                            <Dumbbell className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold">{session.workout_name}</p>
                                                            <p className="text-gray-500 text-xs">{formatDate(session.session_date)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={e => deleteSession(e, session.id)}
                                                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                                    </div>
                                                </div>

                                                {isOpen && (
                                                    <div className="border-t border-white/5 px-5 pb-5 pt-4">
                                                        {session.notes && <p className="text-gray-400 text-sm mb-3 italic">"{session.notes}"</p>}
                                                        {!detail ? (
                                                            <p className="text-gray-600 text-sm">Loading…</p>
                                                        ) : detail.exercise_logs?.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {detail.exercise_logs.map(log => (
                                                                    <div key={log.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                                        <span className="text-gray-300 text-sm">
                                                                            <span className="text-white font-medium">{log.sets}</span> × <span className="text-white font-medium">{log.reps}</span> @ <span className="text-purple-300 font-medium">{log.weight_kg}kg</span>
                                                                            {log.notes && <span className="text-gray-500 ml-2">— {log.notes}</span>}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-600 text-sm">No sets logged in this session.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const EmptyState = ({ icon, text, sub }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">{icon}</div>
        <p className="text-gray-400 text-lg mb-1">{text}</p>
        <p className="text-gray-600 text-sm">{sub}</p>
    </div>
);

export default HistoryPage;
