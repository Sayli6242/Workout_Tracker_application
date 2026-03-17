import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LockKeyhole, Mail, UserPlus } from 'lucide-react';
import { authStyles } from './styles/constants';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            const { error } = await signUp(email, password);
            if (error) throw error;
            navigate('/login');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d17] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-md w-full relative">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-500/25 mb-4">
                        <UserPlus size={28} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create account</h2>
                    <p className="text-gray-500 mt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
                <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
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
                            <input type="password" required placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} disabled={loading}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                                <LockKeyhole size={18} />
                            </span>
                            <input type="password" required placeholder="Confirm password" value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-60 mt-2">
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}