import React, { useState } from 'react';
import { Eye, EyeOff, Mail, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authStyles } from './styles/constants';
import { useAuth } from './AuthContext';
// import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');

            setLoading(true);
            const { error } = await signIn(email, password);
            if (error) throw error;
            // navigate('/Home');
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
        <div className="min-h-screen bg-gradient-to-tr from-rose-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-rose-100">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-600 to-rose-300 bg-clip-text text-transparent">
                            You are welcome
                        </h2>
                        <p className="text-center text-rose-800/60">
                            New here?{' '}
                            <Link to='/register' className="text-rose-600 hover:text-yellow-600 font-medium transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-rose-300">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white/50 placeholder-rose-300"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-rose-300">
                                    <LockKeyhole size={20} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-12 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white/50 placeholder-rose-300"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-rose-300 hover:text-rose-400"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="text-right">
                                <Link to='/forgot-password' className="text-sm text-rose-600 hover:text-yellow-600 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-rose-400 to-rose-300 hover:from-rose-500 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 transition-colors shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}