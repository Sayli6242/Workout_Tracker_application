import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, Activity } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

const inputCls = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30";
const labelCls = "block text-sm font-medium text-gray-300 mb-1.5";

const MeasurementsPage = () => {
    const [measurements, setMeasurements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        weight_kg: '', body_fat_pct: '', chest_cm: '', waist_cm: '',
        hips_cm: '', arms_cm: '', legs_cm: '',
    });

    useEffect(() => { fetchMeasurements(); }, []);

    const fetchMeasurements = async () => {
        try {
            const res = await axios.get('/measurements/');
            setMeasurements(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { logged_at: new Date().toISOString() };
        Object.entries(form).forEach(([k, v]) => { if (v !== '') payload[k] = parseFloat(v); });
        try {
            await axios.post('/measurements/', payload);
            setIsModalOpen(false);
            setForm({ weight_kg: '', body_fat_pct: '', chest_cm: '', waist_cm: '', hips_cm: '', arms_cm: '', legs_cm: '' });
            fetchMeasurements();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/measurements/${id}/`);
            setMeasurements(prev => prev.filter(m => m.id !== id));
        } catch (err) { console.error(err); }
    };

    const chartData = [...measurements]
        .sort((a, b) => (a.logged_at || a.created || '').localeCompare(b.logged_at || b.created || ''))
        .map(m => ({
            date: (m.logged_at || m.created || '').substring(0, 10),
            weight_kg: m.weight_kg || null,
            body_fat_pct: m.body_fat_pct || null,
        }))
        .filter(m => m.weight_kg !== null);

    const recent = measurements.slice(0, 10);

    const latestM = measurements[0];

    const statFields = [
        { key: 'weight_kg', label: 'Weight', unit: 'kg', color: 'from-purple-500 to-violet-600' },
        { key: 'body_fat_pct', label: 'Body Fat', unit: '%', color: 'from-pink-500 to-rose-600' },
        { key: 'chest_cm', label: 'Chest', unit: 'cm', color: 'from-blue-500 to-indigo-600' },
        { key: 'waist_cm', label: 'Waist', unit: 'cm', color: 'from-teal-500 to-cyan-600' },
    ];

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 lg:pt-0">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                            Body Measurements
                        </h1>
                        <p className="text-gray-500 mt-1">{measurements.length} entries logged</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Measurements
                    </button>
                </div>

                {/* Latest stats row */}
                {latestM && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {statFields.map(({ key, label, unit, color }) => (
                            <div key={key} className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`} />
                                <p className="text-gray-500 text-xs mb-1">{label}</p>
                                <p className="text-2xl font-bold text-white">
                                    {latestM[key] ?? '—'}
                                    {latestM[key] != null && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Chart */}
                {chartData.length >= 2 && (
                    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 mb-6">
                        <h2 className="text-base font-semibold text-white mb-4">Weight Over Time</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                    labelStyle={{ color: '#e5e7eb' }}
                                />
                                <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                                <Line type="monotone" dataKey="weight_kg" stroke="#a855f7" strokeWidth={2} name="Weight (kg)" dot={{ r: 3, fill: '#a855f7' }} />
                                {chartData.some(d => d.body_fat_pct) && (
                                    <Line type="monotone" dataKey="body_fat_pct" stroke="#ec4899" strokeWidth={2} name="Body Fat %" dot={{ r: 3, fill: '#ec4899' }} />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Table */}
                {recent.length > 0 ? (
                    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5">
                            <h2 className="text-base font-semibold text-white">History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        {['Date', 'Weight', 'Body Fat', 'Chest', 'Waist', 'Hips', 'Arms', 'Legs', ''].map(h => (
                                            <th key={h} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.map(m => (
                                        <tr key={m.id} className="border-b border-white/5 hover:bg-white/3 group transition-colors">
                                            <td className="py-3 px-4 text-gray-300">{(m.logged_at || m.created || '').substring(0, 10)}</td>
                                            <td className="py-3 px-4 text-white font-medium">{m.weight_kg != null ? `${m.weight_kg} kg` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.body_fat_pct != null ? `${m.body_fat_pct}%` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.chest_cm != null ? `${m.chest_cm}` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.waist_cm != null ? `${m.waist_cm}` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.hips_cm != null ? `${m.hips_cm}` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.arms_cm != null ? `${m.arms_cm}` : '—'}</td>
                                            <td className="py-3 px-4 text-gray-300">{m.legs_cm != null ? `${m.legs_cm}` : '—'}</td>
                                            <td className="py-3 px-4">
                                                <button onClick={() => handleDelete(m.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-[#1a1a2e] border border-white/5 rounded-2xl">
                        <Activity className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No measurements yet</p>
                        <p className="text-gray-600 text-sm">Click "Add Measurements" to start tracking</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-white">Add Measurements</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'weight_kg', label: 'Weight (kg)' },
                                    { key: 'body_fat_pct', label: 'Body Fat %' },
                                    { key: 'chest_cm', label: 'Chest (cm)' },
                                    { key: 'waist_cm', label: 'Waist (cm)' },
                                    { key: 'hips_cm', label: 'Hips (cm)' },
                                    { key: 'arms_cm', label: 'Arms (cm)' },
                                    { key: 'legs_cm', label: 'Legs (cm)' },
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <label className={labelCls}>{label}</label>
                                        <input type="number" step="0.1" value={form[key]}
                                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                            placeholder="—" className={inputCls} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeasurementsPage;
