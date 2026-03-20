import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, FolderOpen, Dumbbell, X, Check } from 'lucide-react';
import Navbar from './Navbar';
import axios from '../lib/axiosConfig';

const folderColors = [
    'from-purple-500 to-violet-600',
    'from-pink-500 to-rose-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-fuchsia-500 to-purple-600',
];

const WorkoutsPage = () => {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => { fetchWorkouts(); }, []);

    const fetchWorkouts = async () => {
        try {
            const r = await axios.get('/folders/');
            setWorkouts(r.data);
        } catch (e) { console.error(e); }
    };

    const createWorkout = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setSaving(true);
        try {
            // Create folder
            const folderRes = await axios.post('/folders/', { name: newName.trim() });
            const folderId = folderRes.data.id;
            // Auto-create default section with same name (hidden from user)
            await axios.post(`/folders/${folderId}/sections/`, { name: newName.trim() });
            setNewName('');
            setShowAddForm(false);
            fetchWorkouts();
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const updateWorkout = async (id) => {
        if (!editName.trim()) return;
        try {
            await axios.put(`/folders/${id}/`, { name: editName.trim() });
            setEditingId(null);
            fetchWorkouts();
        } catch (e) { console.error(e); }
    };

    const deleteWorkout = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`/folders/${id}/`);
            setWorkouts(workouts.filter(w => w.id !== id));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 pb-16 lg:pt-0 lg:pb-0">
            <Navbar />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Workouts</h1>
                        <p className="text-gray-500 mt-1">{workouts.length} workout plan{workouts.length !== 1 ? 's' : ''}</p>
                    </div>
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            New Workout
                        </button>
                    )}
                </div>

                {/* Inline create form */}
                {showAddForm && (
                    <form onSubmit={createWorkout} className="mb-6 flex gap-2 items-center bg-[#1a1a2e] border border-purple-500/30 rounded-2xl p-4 shadow-lg shadow-purple-500/10">
                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Workout name, e.g. Push Day, Leg Day…"
                            autoFocus
                            required
                            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={saving || !newName.trim()}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all shrink-0"
                        >
                            <Check className="w-4 h-4" />
                            {saving ? 'Creating…' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowAddForm(false); setNewName(''); }}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                )}

                {/* Empty state */}
                {workouts.length === 0 && !showAddForm && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Dumbbell className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No workouts yet</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium text-sm shadow-md mt-2"
                        >
                            <Plus className="w-4 h-4" /> Create your first workout
                        </button>
                    </div>
                )}

                {/* Workout grid */}
                {workouts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workouts.map((workout, idx) => {
                            const grad = folderColors[idx % folderColors.length];
                            const isEditing = editingId === workout.id;
                            return (
                                <div
                                    key={workout.id}
                                    onClick={() => !isEditing && navigate(`/workouts/${workout.id}`)}
                                    className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${grad}`} />

                                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${grad} mb-3 shadow-md`}>
                                        <FolderOpen className="w-5 h-5 text-white" />
                                    </div>

                                    {isEditing ? (
                                        <div className="flex gap-2 items-center" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') updateWorkout(workout.id); if (e.key === 'Escape') setEditingId(null); }}
                                                autoFocus
                                                className="flex-1 px-3 py-1.5 bg-white/10 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none"
                                            />
                                            <button onClick={() => updateWorkout(workout.id)} className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-white font-semibold text-lg mb-1 pr-16 truncate">{workout.name}</h3>
                                            <p className="text-gray-500 text-xs">Tap to open</p>
                                        </>
                                    )}

                                    {!isEditing && (
                                        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={e => { e.stopPropagation(); setEditingId(workout.id); setEditName(workout.name); }}
                                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                                            ><Pencil className="w-3.5 h-3.5" /></button>
                                            <button
                                                onClick={e => deleteWorkout(e, workout.id)}
                                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                            ><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutsPage;
