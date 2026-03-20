import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authStyles } from './styles/constants';
import { useAuth } from './AuthContext';

export default function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle state passed from password reset
    useEffect(() => {
        if (location.state) {
            const { message, email: resetEmail, error: locationError, passwordReset } = location.state;

            if (message) {
                setSuccessMessage(message);
            }

            if (resetEmail) {
                setEmail(resetEmail);
            }

            if (locationError) {
                setError(locationError);
            }

            // Clear the location state to prevent showing the message on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccessMessage('');
            setLoading(true);

            await signIn(email, password);

            navigate('/Home');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-[#0d0d17] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-md w-full relative">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25 mb-4">
                        <LockKeyhole size={28} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                    <p className="text-gray-500 mt-2">
                        New here?{' '}
                        <Link to='/register' className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
                <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm">{successMessage}</div>
                        )}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                                <Mail size={18} />
                            </span>
                            <input type="email" required placeholder="Email address" value={email}
                                onChange={(e) => setEmail(e.target.value)} disabled={loading}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                                <LockKeyhole size={18} />
                            </span>
                            <input type={showPassword ? "text" : "password"} required placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} disabled={loading} autoFocus={location.state?.passwordReset}
                                className="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                            <button type="button" onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-gray-300">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="text-right">
                            <Link to='/forgot-password' className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-60">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}