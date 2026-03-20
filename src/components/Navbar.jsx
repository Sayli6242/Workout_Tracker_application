import React from 'react';
import { useAuth } from './auth/AuthContext';
import { LogOut, User, Calendar, Activity, Dumbbell, Home, History } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';

const navLinks = [
    { to: '/Home',         label: 'Home',         icon: Home },
    { to: '/workouts',     label: 'Workouts',      icon: Dumbbell },
    { to: '/history',      label: 'History',       icon: History },
    { to: '/calendar',     label: 'Calendar',      icon: Calendar },
    { to: '/measurements', label: 'Measurements',  icon: Activity },
];

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await signOut(); navigate('/login'); }
        catch (e) { console.error(e); }
    };

    return (
        <>
            {/* ── Desktop sidebar ─────────────────────────────────── */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-[#13131f] border-r border-purple-900/30 flex-col z-40 shadow-xl shadow-black/20">
                {/* Logo */}
                <button
                    onClick={() => navigate('/Home')}
                    className="flex items-center gap-3 px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-colors group w-full"
                >
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 shadow-md shrink-0">
                        <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-base tracking-tight">
                        Workout<span className="text-purple-400">Tracker</span>
                    </span>
                </button>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
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
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Mobile top bar (logo only) ───────────────────────── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#13131f] border-b border-purple-900/30 flex items-center justify-between px-4 z-40 shadow-lg shadow-black/20">
                <button onClick={() => navigate('/Home')} className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500">
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">
                        Workout<span className="text-purple-400">Tracker</span>
                    </span>
                </button>
                {/* User avatar + logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                </button>
            </header>

            {/* ── Mobile bottom tab bar ────────────────────────────── */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#13131f] border-t border-purple-900/30 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
                <div className="flex items-stretch h-16">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                                    isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-purple-600/20' : ''}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
