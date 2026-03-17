import React, { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { LogOut, User, Calendar, Activity, Folder, Dumbbell, Menu, X } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';

const navLinks = [
    { to: '/folders', label: 'Folders', icon: <Folder className="w-5 h-5" /> },
    { to: '/calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { to: '/measurements', label: 'Measurements', icon: <Activity className="w-5 h-5" /> },
];

const SidebarContent = ({ user, onNavigate, onLogout }) => (
    <>
        {/* Logo */}
        <button
            onClick={() => onNavigate('/Home')}
            className="flex items-center gap-3 px-5 py-5 border-b border-white/5 hover:bg-white/5 transition-colors group w-full"
        >
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 shadow-md group-hover:shadow-purple-500/30 transition-shadow shrink-0">
                <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
                Workout<span className="text-purple-400">Tracker</span>
            </span>
        </button>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map(({ to, label, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    onClick={() => onNavigate(null)}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`
                    }
                >
                    {icon}
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
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-medium"
            >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
            </button>
        </div>
    </>
);

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleNavigate = (path) => {
        setDrawerOpen(false);
        if (path) navigate(path);
    };

    return (
        <>
            {/* ── Desktop sidebar (lg+) ── */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-[#13131f] border-r border-purple-900/30 flex-col z-40 shadow-xl shadow-black/20">
                <SidebarContent user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
            </aside>

            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#13131f] border-b border-purple-900/30 flex items-center justify-between px-4 z-40 shadow-lg shadow-black/20">
                <button
                    onClick={() => navigate('/Home')}
                    className="flex items-center gap-2"
                >
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-violet-500">
                        <Dumbbell className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">
                        Workout<span className="text-purple-400">Tracker</span>
                    </span>
                </button>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </header>

            {/* ── Mobile drawer overlay ── */}
            {drawerOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="relative w-64 h-full bg-[#13131f] border-r border-purple-900/30 flex flex-col shadow-2xl">
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarContent user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
                    </aside>
                </div>
            )}
        </>
    );
};

export default Navbar;
