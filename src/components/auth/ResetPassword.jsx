// ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { authStyles } from './styles/constants';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { supabase } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePasswordResetToken = async () => {
            try {
                // Get the hash or search params from URL
                const params = new URLSearchParams(location.hash.replace('#', '') || location.search);
                const accessToken = params.get('access_token');

                if (!accessToken) {
                    throw new Error('No reset token found');
                }

                // Set the session with the access token
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: null
                });

                if (sessionError) throw sessionError;

            } catch (error) {
                console.error('Reset token error:', error);
                navigate('/login', {
                    state: { error: 'Invalid password reset link. Please try again.' }
                });
            }
        };

        handlePasswordResetToken();
    }, [location, navigate, supabase.auth]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Password validation
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setError('');
            setLoading(true);

            // Get current user email before updating password
            const { data: { user } } = await supabase.auth.getUser();
            const userEmail = user?.email;

            if (!userEmail) {
                throw new Error('User email not found');
            }

            // Update the password
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            // Sign out to force new login with new password
            await supabase.auth.signOut();

            // Redirect to login with success message
            navigate('/login', {
                state: {
                    message: 'Password updated successfully! Please sign in with your new password.',
                    email: userEmail,
                    passwordReset: true
                },
                replace: true // Replace history to prevent back navigation
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-rose-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-rose-100">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-600 to-rose-300 bg-clip-text text-transparent">
                            update password
                        </h2>
                        <p className="text-center text-rose-800/60">
                            Please enter your new password
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white/50"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white/50"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-rose-400 to-rose-300 hover:from-rose-500 hover:to-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 transition-colors shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}