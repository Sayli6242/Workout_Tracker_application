import React from 'react';
import { useAuth } from './auth/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-white opacity-90 rounded-lg shadow-sm border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-[#794BC4] hover:text-[#A0522D] transition-colors">
                            Exercise Tracker
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-[#A0522D] hover:text-[#D2691E] transition-colors">
                            <User className="w-5 h-5 mr-2" />
                            <span>{user?.email}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-lg hover:shadow-lg transition-shadow"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>

                    </div>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
