import React, { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { LogOut, User, Dumbbell, Home, History, TrendingUp, LayoutTemplate, Play, X, BookOpen } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from '../lib/axiosConfig';

const navLinks = [
    { to: '/Home',      label: 'Home',      icon: Home          },
    { to: '/templates', label: 'Templates', icon: LayoutTemplate },
    null, // FAB placeholder
    { to: '/progress',  label: 'Progress',  icon: TrendingUp    },
    { to: '/profile',   label: 'Profile',   icon: User          },
];

const sidebarLinks = [
    { to: '/Home',      label: 'Home',      icon: Home          },
    { to: '/templates', label: 'Templates', icon: LayoutTemplate },
    { to: '/history',   label: 'History',   icon: History       },
    { to: '/library',   label: 'Library',   icon: BookOpen      },
    { to: '/progress',  label: 'Progress',  icon: TrendingUp    },
    { to: '/profile',   label: 'Profile',   icon: User          },
];

function QuickStartSheet({ onClose }) {
    const navigate  = useNavigate();
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [loaded, setLoaded] = useState(false);

    React.useEffect(() => {
        axios.get('/templates/').then(r => {
            setTemplates((r.data || []).slice(0, 3));
            setLoaded(true);
        }).catch(() => setLoaded(true));
    }, []);

    const startBlank = async () => {
        setLoading(true);
        try {
            await axios.post('/active-workout/', { workout_name: 'Quick Workout' });
            onClose();
            navigate('/workout/active');
        } catch (e) {
            if (e?.response?.status === 400) { onClose(); navigate('/workout/active'); }
            else console.error(e);
        }
        finally { setLoading(false); }
    };

    const startFromTemplate = async (t) => {
        setLoading(true);
        try {
            await axios.post('/active-workout/', { template_id: t.id, workout_name: t.name });
            onClose();
            navigate('/workout/active');
        } catch (e) {
            if (e?.response?.status === 400) { onClose(); navigate('/workout/active'); }
            else console.error(e);
        }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg bg-[#13131f] rounded-t-3xl border-t border-white/10 shadow-2xl p-5 pb-8"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-bold text-lg">Start Workout</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
                </div>

                {/* Quick start blank */}
                <button onClick={startBlank} disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold mb-4
                        shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all
                        flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                             : <Play className="w-5 h-5 fill-current" />}
                    Quick Start (Empty)
                </button>

                {/* Recent templates */}
                {loaded && templates.length > 0 && (
                    <>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Recent Templates</p>
                        <div className="space-y-2">
                            {templates.map(t => (
                                <button key={t.id} onClick={() => startFromTemplate(t)} disabled={loading}
                                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5
                                        hover:border-purple-500/30 hover:bg-white/10 transition-all text-left disabled:opacity-60">
                                    <div className="p-2 rounded-lg bg-purple-600/20">
                                        <Dumbbell className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="text-white font-medium text-sm flex-1 truncate">{t.name}</span>
                                    <Play className="w-4 h-4 text-purple-400 fill-current flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </>
                )}

                <button onClick={() => { onClose(); navigate('/templates'); }}
                    className="w-full mt-3 py-3 rounded-xl bg-white/5 text-gray-400 font-medium text-sm
                        hover:bg-white/10 hover:text-white transition-colors">
                    Browse All Templates
                </button>
            </div>
        </div>
    );
}

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [showSheet, setShowSheet] = useState(false);

    const handleLogout = async () => {
        try { await signOut(); navigate('/login'); }
        catch (e) { console.error(e); }
    };

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────── */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-[#13131f] border-r border-purple-900/30 flex-col z-40 shadow-xl shadow-black/20">
                {/* Logo */}
                <button onClick={() => navigate('/Home')}
                    className="flex items-center gap-3 px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-colors group w-full">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 shadow-md shrink-0">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-base tracking-tight">
                        Workout<span className="text-purple-400">Tracker</span>
                    </span>
                </button>

                {/* Start workout button */}
                <div className="px-3 pt-4 pb-2">
                    <button onClick={() => setShowSheet(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                            bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm
                            shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all">
                        <Play className="w-4 h-4 fill-current" />
                        Start Workout
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                    {sidebarLinks.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                            <Icon className="w-5 h-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* User + logout */}
                <div className="px-3 py-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-300 text-xs truncate">{user?.email}</span>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20
                            text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium">
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Mobile top bar ───────────────────────────────────── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#13131f] border-b border-purple-900/30 flex items-center justify-between px-4 z-40 shadow-lg shadow-black/20">
                <button onClick={() => navigate('/Home')} className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500">
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">
                        Workout<span className="text-purple-400">Tracker</span>
                    </span>
                </button>
                <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20
                        text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium">
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                </button>
            </header>

            {/* ── Mobile bottom tab bar ────────────────────────────── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#13131f] border-t border-purple-900/30 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <div className="flex items-stretch h-16 relative">
                    {navLinks.map((link, i) => {
                        if (!link) {
                            // Center FAB
                            return (
                                <div key="fab" className="flex-1 flex items-center justify-center">
                                    <button
                                        onClick={() => setShowSheet(true)}
                                        className="absolute -top-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600
                                            shadow-lg shadow-purple-900/50 border-4 border-[#0d0d17]
                                            flex items-center justify-center hover:from-purple-500 hover:to-violet-500 transition-all"
                                    >
                                        <Play className="w-6 h-6 text-white fill-current" />
                                    </button>
                                </div>
                            );
                        }
                        const { to, label, icon: Icon } = link;
                        return (
                            <NavLink key={to} to={to}
                                className={({ isActive }) =>
                                    `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                                        isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
                                    }`}>
                                {({ isActive }) => (
                                    <>
                                        <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-purple-600/20' : ''}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span>{label}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Quick start bottom sheet */}
            {showSheet && <QuickStartSheet onClose={() => setShowSheet(false)} />}
        </>
    );
};

export default Navbar;
