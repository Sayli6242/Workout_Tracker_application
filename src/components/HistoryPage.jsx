import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Dumbbell, ChevronDown, ChevronUp, Trash2, History, BarChart2, SlidersHorizontal, X } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

// ── Helpers ────────────────────────────────────────────────────────────────────
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

// ── Workout type metadata ──────────────────────────────────────────────────────
const TYPE_META = {
    hiit:               { label: 'HIIT',               category: 'Cardio',  emoji: '🔥', badge: 'bg-orange-500/10 border-orange-500/30 text-orange-300' },
    gym:                { label: 'Gym Workout',         category: 'Gym',     emoji: '🏋️', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
    machine:            { label: 'Machine',             category: 'Gym',     emoji: '⚙️', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
    equipment:          { label: 'Equipment',           category: 'Gym',     emoji: '🪆', badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
    beginner:           { label: 'Beginner',            category: 'General', emoji: '🌱', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
    intermediate:       { label: 'Intermediate',        category: 'General', emoji: '💪', badge: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
    pro:                { label: 'Pro / Advanced',      category: 'General', emoji: '🏆', badge: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' },
    yoga:               { label: 'Yoga',                category: 'Yoga',    emoji: '🧘', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    mat_yoga:           { label: 'Mat Yoga',            category: 'Yoga',    emoji: '🪷', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    beginner_yoga:      { label: 'Beginner Yoga',       category: 'Yoga',    emoji: '🌿', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    intermediate_yoga:  { label: 'Intermediate Yoga',   category: 'Yoga',    emoji: '☯️', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    morning_yoga:       { label: 'Morning Yoga',        category: 'Yoga',    emoji: '🌅', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    relaxation_yoga:    { label: 'Relaxation Yoga',     category: 'Yoga',    emoji: '😌', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
    stress_relief_yoga: { label: 'Stress Relief Yoga',  category: 'Yoga',    emoji: '🌊', badge: 'bg-teal-500/10 border-teal-500/30 text-teal-300' },
};

const CATEGORY_FILTERS = ['All', 'Cardio', 'Gym', 'General', 'Yoga'];
const LEVEL_FILTERS    = ['All', 'beginner', 'intermediate', 'advanced'];
const SORT_OPTIONS     = [
    { value: 'session_date_desc', label: 'Newest First' },
    { value: 'session_date_asc',  label: 'Oldest First' },
    { value: 'workout_name_asc',  label: 'Name A–Z' },
    { value: 'workout_type_asc',  label: 'Type A–Z' },
];

const TABS = ['Day', 'Week', 'Session'];

// ── Type badge component ───────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    if (!type) return null;
    const meta = TYPE_META[type];
    if (!meta) return <span className="px-2 py-0.5 text-xs rounded-lg border bg-white/5 border-white/10 text-gray-400">{type}</span>;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg border font-medium ${meta.badge}`}>
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
        </span>
    );
};

const TagBadge = ({ tag }) => (
    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-xs">{tag}</span>
);

// ── Main component ─────────────────────────────────────────────────────────────
const HistoryPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('Day');
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [expandedSession, setExpandedSession] = useState(null);
    const [sessionDetails, setSessionDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // Filter & sort state
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterLevel, setFilterLevel]    = useState('All');
    const [filterType, setFilterType]      = useState('');
    const [filterTag, setFilterTag]        = useState('');
    const [sortOption, setSortOption]      = useState('session_date_desc');

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

    // ── Filtered + sorted sessions ──
    const filteredSessions = sessions
        .filter(s => {
            if (filterCategory !== 'All' && s.category !== filterCategory.toLowerCase()) return false;
            if (filterLevel !== 'All' && s.level !== filterLevel) return false;
            if (filterType && s.workout_type !== filterType) return false;
            if (filterTag) {
                const tags = Array.isArray(s.tags)
                    ? s.tags
                    : (s.tags || '').split(',').filter(Boolean);
                if (!tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase()))) return false;
            }
            return true;
        })
        .sort((a, b) => {
            const [field, dir] = sortOption.split('_').reduce((acc, cur, i, arr) => {
                if (i === arr.length - 1) return [arr.slice(0, -1).join('_'), cur];
                return acc;
            }, ['', '']);
            const va = (a[field] || '').toLowerCase();
            const vb = (b[field] || '').toLowerCase();
            return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        });

    const activeFilterCount = [
        filterCategory !== 'All',
        filterLevel !== 'All',
        !!filterType,
        !!filterTag,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setFilterCategory('All');
        setFilterLevel('All');
        setFilterType('');
        setFilterTag('');
        setSortOption('session_date_desc');
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
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

                    {/* Filter toggle (only for Session tab) */}
                    {tab === 'Session' && (
                        <button
                            onClick={() => setShowFilters(v => !v)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-semibold">{activeFilterCount}</span>
                            )}
                        </button>
                    )}
                </div>

                {/* Filter panel */}
                {tab === 'Session' && showFilters && (
                    <div className="mb-6 p-5 bg-[#1a1a2e] border border-white/5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">Filter Sessions</p>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                    <X className="w-3 h-3" /> Clear all
                                </button>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Category</p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_FILTERS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setFilterCategory(c)}
                                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${filterCategory === c ? 'bg-purple-600/30 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Level</p>
                            <div className="flex flex-wrap gap-2">
                                {LEVEL_FILTERS.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setFilterLevel(l)}
                                        className={`px-3 py-1 rounded-lg border text-xs font-medium capitalize transition-all ${filterLevel === l ? 'bg-purple-600/30 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Workout type */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Workout Type</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterType('')}
                                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${!filterType ? 'bg-purple-600/30 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                >
                                    All
                                </button>
                                {Object.entries(TYPE_META).map(([key, meta]) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilterType(filterType === key ? '' : key)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-medium transition-all ${filterType === key ? meta.badge.replace('10', '30') + ' scale-105' : meta.badge}`}
                                    >
                                        <span>{meta.emoji}</span> {meta.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tag search */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Search by Tag</p>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    value={filterTag}
                                    onChange={e => setFilterTag(e.target.value)}
                                    placeholder="e.g. yoga, hiit, calm…"
                                    className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 text-sm"
                                />
                                {filterTag && (
                                    <button onClick={() => setFilterTag('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Sort By</p>
                            <div className="flex flex-wrap gap-2">
                                {SORT_OPTIONS.map(o => (
                                    <button
                                        key={o.value}
                                        onClick={() => setSortOption(o.value)}
                                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${sortOption === o.value ? 'bg-purple-600/30 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

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
                            <>
                                {/* Active filter summary */}
                                {activeFilterCount > 0 && (
                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                                        <span>Showing <span className="text-white font-medium">{filteredSessions.length}</span> of {sessions.length} sessions</span>
                                        <button onClick={clearFilters} className="text-purple-400 hover:text-purple-300 text-xs underline">Clear filters</button>
                                    </div>
                                )}

                                {filteredSessions.length === 0 ? (
                                    sessions.length === 0
                                        ? <EmptyState icon={<Clock className="w-10 h-10 text-gray-700" />} text="No sessions recorded" sub="Use 'Start Session' on any workout to begin tracking" />
                                        : <EmptyState icon={<SlidersHorizontal className="w-10 h-10 text-gray-700" />} text="No sessions match your filters" sub="Try adjusting or clearing the filters" />
                                ) : (
                                    <div className="space-y-3">
                                        {filteredSessions.map(session => {
                                            const isOpen = expandedSession === session.id;
                                            const detail = sessionDetails[session.id];
                                            const tags = Array.isArray(session.tags)
                                                ? session.tags
                                                : (session.tags || '').split(',').filter(Boolean);

                                            return (
                                                <div key={session.id} className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/10 transition-colors">
                                                    <div className="h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                                                    <div
                                                        className="flex items-center justify-between p-5 cursor-pointer"
                                                        onClick={() => toggleSession(session.id)}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="p-2 rounded-xl bg-purple-600/20 shrink-0">
                                                                <Dumbbell className="w-4 h-4 text-purple-400" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-white font-semibold truncate">{session.workout_name}</p>
                                                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                                                    <p className="text-gray-500 text-xs">{formatDate(session.session_date)}</p>
                                                                    {session.workout_type && <TypeBadge type={session.workout_type} />}
                                                                    {session.level && session.level !== 'all' && (
                                                                        <span className="px-2 py-0.5 text-xs rounded-lg border bg-white/5 border-white/10 text-gray-400 capitalize">{session.level}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
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

                                                            {/* Tags */}
                                                            {tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                                    {tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                                                                </div>
                                                            )}

                                                            {!detail ? (
                                                                <p className="text-gray-600 text-sm">Loading…</p>
                                                            ) : detail.exercise_logs?.length > 0 ? (
                                                                <div className="space-y-2">
                                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Exercise Logs</p>
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
                                )}
                            </>
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
