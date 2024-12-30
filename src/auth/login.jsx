import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const AuthCard = ({ children, title }) => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
        <div className="max-w-md w-full m-4 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl space-y-6 border border-white/20">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {title}
            </h2>
            {children}
        </div>
    </div>
);

const FormInput = ({ label, type, value, onChange, required, minLength }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            required={required}
            minLength={minLength}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            value={value}
            onChange={onChange}
        />
    </div>
);

const ErrorMessage = ({ message }) =>
    message ? (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={20} />
            <p className="text-sm">{message}</p>
        </div>
    ) : null;

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthCard title="Welcome Back">
            <ErrorMessage message={error} />
            <form onSubmit={handleLogin} className="space-y-6">
                <FormInput
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Sign In
                </button>
            </form>
        </AuthCard>
    );
};

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
            });
            if (error) throw error;
            alert('Please check your email for verification link');
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthCard title="Create Account">
            <ErrorMessage message={error} />
            <form onSubmit={handleSignup} className="space-y-6">
                <FormInput
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                />
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Sign Up
                </button>
            </form>
        </AuthCard>
    );
};