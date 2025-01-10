// / ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { authStyles } from './styles/constants';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { supabase } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setMessage('');
            setLoading(true);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage('Check your email for the password reset link');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={authStyles.pageWrapper}
            style={{ backgroundImage: authStyles.backgroundImage }}
        >
            <div className="max-w-md w-full mx-4">
                <div className={authStyles.cardOverlay}>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Reset Password
                        </h2>
                        <p className="text-center text-gray-600">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{message}</span>
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}