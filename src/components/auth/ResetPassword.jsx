// ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
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
        // Verify user is in password recovery flow
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            // If no user or no recovery token, redirect to login
            if (!user || !location.search.includes('token')) {
                navigate('/login', {
                    state: { error: 'Invalid password reset session. Please try again.' }
                });
            }
        };

        checkUser();
    }, []);

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

            // Get user email from the session
            const { data: { user } } = await supabase.auth.getUser();
            const userEmail = user?.email;

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            // Sign out the user to ensure they need to login with new password
            await supabase.auth.signOut();

            // Redirect to login with success message and email pre-filled
            navigate('/login', {
                state: {
                    message: 'Password reset successfully! Please login with your new password.',
                    email: userEmail,
                    passwordReset: true
                }
            });
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
                            Set New Password
                        </h2>
                        <p className="text-center text-gray-600">
                            Enter a new secure password
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}