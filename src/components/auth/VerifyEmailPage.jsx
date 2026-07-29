import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailCheck, XCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/auth';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Case 1: PKCE flow — token_hash in query params (?token_hash=xxx&type=email)
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type') || 'email';

        if (token_hash) {
            supabase.auth.verifyOtp({ token_hash, type })
                .then(({ error }) => {
                    if (error) throw error;
                    setStatus('success');
                })
                .catch(err => {
                    setStatus('error');
                    setErrorMsg(err.message || 'Verification failed. The link may have expired.');
                });
            return;
        }

        // Case 2: Implicit flow — tokens in URL hash (#access_token=xxx&type=signup)
        const hash = window.location.hash.substring(1);
        if (hash) {
            const hashParams = new URLSearchParams(hash);
            if (hashParams.get('error')) {
                setStatus('error');
                setErrorMsg(hashParams.get('error_description') || 'Verification failed.');
                return;
            }
            if (hashParams.get('access_token')) {
                // Supabase already verified the email and signed the user in
                setStatus('success');
                return;
            }
        }

        // No token found
        setStatus('error');
        setErrorMsg('No verification token found. Please click the link from your email again.');
    }, []);

    return (
        <div className="min-h-screen bg-[#0d0d17] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full relative text-center">
                {status === 'loading' && (
                    <>
                        <div className="inline-flex p-4 rounded-2xl bg-purple-600/20 mb-6">
                            <Loader size={32} className="text-purple-400 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Verifying your email…</h2>
                        <p className="text-gray-500 mt-2">Please wait a moment.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-6">
                            <MailCheck size={32} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Email verified!</h2>
                        <p className="text-gray-400 mb-8">Your account is now active. You can sign in.</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all"
                        >
                            Go to Sign In
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="inline-flex p-4 rounded-2xl bg-red-500/20 border border-red-500/30 mb-6">
                            <XCircle size={32} className="text-red-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Verification failed</h2>
                        <p className="text-gray-400 mb-2">{errorMsg}</p>
                        <p className="text-gray-500 text-sm mb-8">Try registering again or contact support.</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all"
                        >
                            Back to Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
