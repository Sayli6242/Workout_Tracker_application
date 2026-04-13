import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash2, Pencil, Dumbbell, ClipboardList, BarChart2, ChevronDown, ChevronUp, Trophy, Check, X, ImagePlus, PlayCircle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

const PB_URL = 'http://127.0.0.1:8090';

const getImageUrl = (ex) => {
    if (ex.image) return `${PB_URL}/api/files/${ex.collectionId}/${ex.id}/${ex.image}`;
    if (ex.image_url) return ex.image_url;
    return null;
};

const inputCls = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 text-sm";
const labelCls = "block text-xs font-medium text-gray-400 mb-1";

// ── Workout type metadata ──────────────────────────────────────────────────────
const TYPE_META = {
    hiit:               { label: 'HIIT',               category: 'Cardio',  emoji: '🔥', bg: 'bg-orange-500/10 border-orange-500/30 text-orange-300',   sel: 'bg-orange-500/30 border-orange-400 text-orange-200' },
    gym:                { label: 'Gym Workout',         category: 'Gym',     emoji: '🏋️', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',         sel: 'bg-blue-500/30 border-blue-400 text-blue-200' },
    machine:            { label: 'Machine',             category: 'Gym',     emoji: '⚙️', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',         sel: 'bg-blue-500/30 border-blue-400 text-blue-200' },
    equipment:          { label: 'Equipment',           category: 'Gym',     emoji: '🪆', bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',         sel: 'bg-blue-500/30 border-blue-400 text-blue-200' },
    beginner:           { label: 'Beginner',            category: 'General', emoji: '🌱', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300', sel: 'bg-emerald-500/30 border-emerald-400 text-emerald-200' },
    intermediate:       { label: 'Intermediate',        category: 'General', emoji: '💪', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',   sel: 'bg-purple-500/30 border-purple-400 text-purple-200' },
    pro:                { label: 'Pro / Advanced',      category: 'General', emoji: '🏆', bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',   sel: 'bg-yellow-500/30 border-yellow-400 text-yellow-200' },
    yoga:               { label: 'Yoga',                category: 'Yoga',    emoji: '🧘', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    mat_yoga:           { label: 'Mat Yoga',            category: 'Yoga',    emoji: '🪷', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    beginner_yoga:      { label: 'Beginner Yoga',       category: 'Yoga',    emoji: '🌿', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    intermediate_yoga:  { label: 'Intermediate Yoga',   category: 'Yoga',    emoji: '☯️', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    morning_yoga:       { label: 'Morning Yoga',        category: 'Yoga',    emoji: '🌅', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    relaxation_yoga:    { label: 'Relaxation Yoga',     category: 'Yoga',    emoji: '😌', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
    stress_relief_yoga: { label: 'Stress Relief Yoga',  category: 'Yoga',    emoji: '🌊', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',         sel: 'bg-teal-500/30 border-teal-400 text-teal-200' },
};
const CATEGORIES = ['Cardio', 'Gym', 'General', 'Yoga'];

// ── Exercise add/edit form ─────────────────────────────────────────────────────
const ExerciseForm = ({ initial, onSave, onCancel, saving }) => {
    const [name, setName] = useState(initial?.name || '');
    const [desc, setDesc] = useState(initial?.description || '');
    const [targetSets, setTargetSets] = useState(initial?.target_sets ?? 3);
    const [targetReps, setTargetReps] = useState(initial?.target_reps ?? 10);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const nameRef = useRef(null);
    useEffect(() => { nameRef.current?.focus(); }, []);

    const handleImage = (e) => {
        const f = e.target.files[0];
        if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
    };

    return (
        <form
            onSubmit={e => { e.preventDefault(); if (name.trim()) onSave({ name, description: desc, target_sets: parseInt(targetSets), target_reps: parseInt(targetReps), image }); }}
            className="bg-[#1a1a2e] border border-purple-500/30 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/10"
        >
            <div className="h-0.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-purple-600/20">
                        <Dumbbell className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-white">{initial ? 'Edit Exercise' : 'Add Exercise'}</span>
                </div>
                <div>
                    <label className={labelCls}>Exercise name <span className="text-red-400">*</span></label>
                    <input ref={nameRef} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bench Press, Squat…" required className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <label className={labelCls}>Target sets</label>
                        <input type="number" min="1" max="20" value={targetSets} onChange={e => setTargetSets(e.target.value)} className={inputCls} />
                    </div>
                    <span className="text-gray-500 mt-4 text-sm">×</span>
                    <div className="flex-1">
                        <label className={labelCls}>Target reps</label>
                        <input type="number" min="1" max="100" value={targetReps} onChange={e => setTargetReps(e.target.value)} className={inputCls} />
                    </div>
                </div>
                <div>
                    <label className={labelCls}>Description <span className="text-gray-600">(optional)</span></label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Form tips, muscles targeted…" className={`${inputCls} resize-none`} />
                </div>
                <div>
                    <label className={labelCls}>Image <span className="text-gray-600">(optional)</span></label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-purple-500/30 transition-colors group w-fit">
                        <ImagePlus className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-gray-300">{image ? image.name : 'Choose image…'}</span>
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                    {preview && <img src={preview} alt="preview" className="mt-2 h-24 rounded-lg object-cover border border-white/10" />}
                </div>
                <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={saving || !name.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium shadow-md transition-all">
                        <Check className="w-3.5 h-3.5" />
                        {saving ? 'Saving…' : (initial ? 'Save Changes' : 'Add Exercise')}
                    </button>
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-colors">Cancel</button>
                </div>
            </div>
        </form>
    );
};

// ── Session type picker panel ──────────────────────────────────────────────────
const SessionPanel = ({ workoutName, onSave, onCancel, saving }) => {
    const [selectedType, setSelectedType] = useState('');
    const [notes, setNotes] = useState('');

    const grouped = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = Object.entries(TYPE_META).filter(([, m]) => m.category === cat);
        return acc;
    }, {});

    return (
        <div className="bg-[#1a1a2e] border border-indigo-500/30 rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/10 mb-6">
            <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-600/20">
                            <PlayCircle className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Start Session</p>
                            <p className="text-gray-500 text-xs">{workoutName} — pick a workout type</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Type grid by category */}
                <div className="space-y-4 mb-4">
                    {CATEGORIES.map(cat => (
                        <div key={cat}>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{cat}</p>
                            <div className="flex flex-wrap gap-2">
                                {grouped[cat].map(([key, meta]) => {
                                    const isSelected = selectedType === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setSelectedType(isSelected ? '' : key)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${isSelected ? meta.sel + ' ring-1 ring-offset-0 ring-white/20 scale-105' : meta.bg} hover:opacity-90`}
                                        >
                                            <span>{meta.emoji}</span>
                                            <span>{meta.label}</span>
                                            {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notes */}
                <div className="mb-4">
                    <label className={labelCls}>Notes <span className="text-gray-600">(optional)</span></label>
                    <input
                        type="text"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="How are you feeling today?"
                        className={inputCls}
                    />
                </div>

                {/* Selected type preview */}
                {selectedType && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border mb-4 ${TYPE_META[selectedType].bg}`}>
                        <span className="text-base">{TYPE_META[selectedType].emoji}</span>
                        <span className="text-sm font-medium">{TYPE_META[selectedType].label}</span>
                        <span className="text-xs opacity-60 ml-auto">{TYPE_META[selectedType].category}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => onSave(selectedType, notes)}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                    >
                        <PlayCircle className="w-4 h-4" />
                        {saving ? 'Starting…' : 'Start Session'}
                    </button>
                    <button onClick={onCancel} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-sm transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ── Main component ─────────────────────────────────────────────────────────────
const WorkoutDetailPage = () => {
    const { workoutId } = useParams();
    const navigate = useNavigate();

    const [workoutName, setWorkoutName] = useState('');
    const [sectionId, setSectionId] = useState(null);
    const [exercises, setExercises] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [formSaving, setFormSaving] = useState(false);

    // Session panel
    const [showSessionPanel, setShowSessionPanel] = useState(false);
    const [sessionSaving, setSessionSaving] = useState(false);
    const [sessionCreated, setSessionCreated] = useState(false);

    // Per-exercise inline log forms
    const [showLogForm, setShowLogForm] = useState({});
    const [logForms, setLogForms] = useState({});
    const [logSaving, setLogSaving] = useState({});

    // Per-exercise data
    const [exerciseLogs, setExerciseLogs] = useState({});
    const [exercisePRs, setExercisePRs] = useState({});
    const [chartData, setChartData] = useState({});
    const [showChart, setShowChart] = useState({});

    useEffect(() => { init(); }, [workoutId]);

    const init = async () => {
        try {
            const [folderRes, sectionsRes] = await Promise.all([
                axios.get(`/folders/${workoutId}`),
                axios.get(`/folders/${workoutId}/sections/`),
            ]);
            setWorkoutName(folderRes.data.name);
            const sid = sectionsRes.data[0]?.id;
            if (!sid) {
                const newSec = await axios.post(`/folders/${workoutId}/sections/`, { name: folderRes.data.name });
                setSectionId(newSec.data.id);
                fetchExercises(workoutId, newSec.data.id);
            } else {
                setSectionId(sid);
                fetchExercises(workoutId, sid);
            }
        } catch (e) { console.error(e); }
    };

    const fetchExercises = async (fid, sid) => {
        try {
            const r = await axios.get(`/folders/${fid}/sections/${sid}/exercises/`);
            setExercises(r.data);
            r.data.forEach(ex => { fetchLogs(ex.id); fetchPR(ex.id); });
        } catch (e) { console.error(e); }
    };

    const fetchLogs = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/?exercise_id=${id}`);
            setExerciseLogs(prev => ({ ...prev, [id]: r.data }));
        } catch (e) {}
    };

    const fetchPR = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/pr/?exercise_id=${id}`);
            setExercisePRs(prev => ({ ...prev, [id]: r.data }));
        } catch (e) {}
    };

    const fetchChart = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/chart/?exercise_id=${id}`);
            setChartData(prev => ({ ...prev, [id]: r.data }));
        } catch (e) {}
    };

    const toggleChart = (id) => {
        const next = !showChart[id];
        setShowChart(prev => ({ ...prev, [id]: next }));
        if (next && !chartData[id]) fetchChart(id);
    };

    const toggleLogForm = (id, ex) => {
        const next = !showLogForm[id];
        setShowLogForm(prev => ({ ...prev, [id]: next }));
        if (next) {
            setLogForms(prev => ({
                ...prev,
                [id]: { sets: ex.target_sets ?? 3, reps: ex.target_reps ?? 10, weight_kg: '', notes: '' }
            }));
        }
    };

    const updateLogForm = (id, field, value) => {
        setLogForms(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const submitLog = async (exerciseId) => {
        const form = logForms[exerciseId] || {};
        if (!form.weight_kg) return;
        setLogSaving(prev => ({ ...prev, [exerciseId]: true }));
        try {
            await axios.post('/exercise-logs/', {
                exercise_id: exerciseId,
                sets: parseInt(form.sets),
                reps: parseInt(form.reps),
                weight_kg: parseFloat(form.weight_kg),
                notes: form.notes || '',
                logged_at: new Date().toISOString(),
            });
            fetchLogs(exerciseId);
            fetchPR(exerciseId);
            if (showChart[exerciseId]) fetchChart(exerciseId);
            setShowLogForm(prev => ({ ...prev, [exerciseId]: false }));
        } catch (e) { console.error(e); }
        setLogSaving(prev => ({ ...prev, [exerciseId]: false }));
    };

    const deleteLog = async (logId, exerciseId) => {
        try {
            await axios.delete(`/exercise-logs/${logId}/`);
            fetchLogs(exerciseId);
            fetchPR(exerciseId);
        } catch (e) {}
    };

    const handleSaveNew = async ({ name, description, target_sets, target_reps, image }) => {
        if (!sectionId) return;
        setFormSaving(true);
        const fd = new FormData();
        fd.append('name', name);
        fd.append('description', description || '');
        fd.append('target_sets', target_sets);
        fd.append('target_reps', target_reps);
        if (image) fd.append('image', image);
        try {
            await axios.post(`/folders/${workoutId}/sections/${sectionId}/exercises/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            fetchExercises(workoutId, sectionId);
            setShowAddForm(false);
        } catch (e) { console.error(e); }
        setFormSaving(false);
    };

    const handleSaveEdit = async ({ name, description, target_sets, target_reps, image }) => {
        setFormSaving(true);
        const fd = new FormData();
        fd.append('name', name);
        fd.append('description', description || '');
        fd.append('target_sets', target_sets);
        fd.append('target_reps', target_reps);
        if (image) fd.append('image', image);
        try {
            await axios.put(`/folders/${workoutId}/sections/${sectionId}/exercises/${editingExercise.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            fetchExercises(workoutId, sectionId);
            setEditingExercise(null);
        } catch (e) { console.error(e); }
        setFormSaving(false);
    };

    const deleteExercise = async (id) => {
        try {
            await axios.delete(`/folders/${workoutId}/sections/${sectionId}/exercises/${id}/`);
            setExercises(exercises.filter(ex => ex.id !== id));
        } catch (e) {}
    };

    const handleStartSession = async (workoutType, notes) => {
        setSessionSaving(true);
        try {
            await axios.post('/workout-sessions/', {
                workout_id: workoutId,
                workout_name: workoutName,
                workout_type: workoutType || null,
                notes: notes || '',
            });
            setShowSessionPanel(false);
            setSessionCreated(true);
            setTimeout(() => setSessionCreated(false), 4000);
        } catch (e) { console.error(e); }
        setSessionSaving(false);
    };

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 pb-16 lg:pt-0 lg:pb-0">
            <Navbar />
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <button onClick={() => navigate('/workouts')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Workouts
                        </button>
                        <h1 className="text-3xl font-bold text-white">{workoutName || '…'}</h1>
                        <p className="text-gray-500 mt-1">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Start Session button */}
                        {!showSessionPanel && (
                            <button
                                onClick={() => { setShowSessionPanel(true); setShowAddForm(false); }}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all w-full sm:w-auto"
                            >
                                <PlayCircle className="w-4 h-4" />
                                Start Session
                            </button>
                        )}
                        {!showAddForm && !editingExercise && !showSessionPanel && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4" /> Add Exercise
                            </button>
                        )}
                    </div>
                </div>

                {/* Session created toast */}
                {sessionCreated && (
                    <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-emerald-300 text-sm font-medium">Session started! You can view it in <button onClick={() => navigate('/history')} className="underline hover:text-white transition-colors">History</button>.</p>
                        <button onClick={() => setSessionCreated(false)} className="ml-auto text-emerald-500 hover:text-emerald-300"><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* Session type picker */}
                {showSessionPanel && (
                    <SessionPanel
                        workoutName={workoutName}
                        onSave={handleStartSession}
                        onCancel={() => setShowSessionPanel(false)}
                        saving={sessionSaving}
                    />
                )}

                {/* Inline add form */}
                {showAddForm && (
                    <div className="mb-6">
                        <ExerciseForm onSave={handleSaveNew} onCancel={() => setShowAddForm(false)} saving={formSaving} />
                    </div>
                )}

                {/* Empty state */}
                {exercises.length === 0 && !showAddForm && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Dumbbell className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No exercises yet</p>
                        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium text-sm shadow-md mt-2">
                            <Plus className="w-4 h-4" /> Add first exercise
                        </button>
                    </div>
                )}

                {/* Exercise cards */}
                <div className="space-y-4">
                    {exercises.map(exercise => {
                        const pr = exercisePRs[exercise.id];
                        const logs = exerciseLogs[exercise.id] || [];
                        const chart = chartData[exercise.id] || [];
                        const isChartOpen = showChart[exercise.id];
                        const isLogOpen = showLogForm[exercise.id];
                        const form = logForms[exercise.id] || { sets: exercise.target_sets ?? 3, reps: exercise.target_reps ?? 10, weight_kg: '', notes: '' };
                        const saving = logSaving[exercise.id];
                        const isEditing = editingExercise?.id === exercise.id;

                        if (isEditing) {
                            return (
                                <ExerciseForm
                                    key={exercise.id}
                                    initial={exercise}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditingExercise(null)}
                                    saving={formSaving}
                                />
                            );
                        }

                        return (
                            <div key={exercise.id} className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all duration-300">
                                <div className="h-0.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-md shrink-0">
                                                <Dumbbell className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-xl font-semibold text-white truncate">{exercise.name}</h2>
                                                <p className="text-gray-500 text-xs mt-0.5">
                                                    Target: <span className="text-gray-300">{exercise.target_sets ?? 3} sets × {exercise.target_reps ?? 10} reps</span>
                                                </p>
                                            </div>
                                        </div>
                                        {pr && pr.max_weight_kg > 0 && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg shrink-0">
                                                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                                <span className="text-yellow-300 text-xs font-medium">{pr.max_weight_kg}kg × {pr.max_reps}</span>
                                            </div>
                                        )}
                                    </div>

                                    {getImageUrl(exercise) && (
                                        <img src={getImageUrl(exercise)} alt={exercise.name} className="w-full max-h-64 object-contain rounded-xl bg-black/20 mb-4" />
                                    )}

                                    {exercise.description && (
                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exercise.description}</p>
                                    )}

                                    {isLogOpen && (
                                        <div className="mb-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-3">Log a Set</p>
                                            <div className="grid grid-cols-3 gap-2 mb-2">
                                                {[['Sets', 'sets', '1'], ['Reps', 'reps', '1'], ['Weight (kg)', 'weight_kg', '0.5']].map(([lbl, key, step]) => (
                                                    <div key={key}>
                                                        <label className={labelCls}>{lbl}</label>
                                                        <input
                                                            type="number" min="0" step={step}
                                                            value={form[key]}
                                                            onChange={e => updateLogForm(exercise.id, key, e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && submitLog(exercise.id)}
                                                            className={inputCls}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mb-3">
                                                <label className={labelCls}>Notes <span className="text-gray-600">(optional)</span></label>
                                                <input type="text" value={form.notes} onChange={e => updateLogForm(exercise.id, 'notes', e.target.value)} placeholder="How did it feel?" onKeyDown={e => e.key === 'Enter' && submitLog(exercise.id)} className={inputCls} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => submitLog(exercise.id)} disabled={saving || !form.weight_kg} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                                                    {saving ? 'Saving…' : 'Save'}
                                                </button>
                                                <button onClick={() => toggleLogForm(exercise.id, exercise)} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
                                            </div>
                                        </div>
                                    )}

                                    {logs.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ClipboardList className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Sets</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {logs.slice(0, 5).map(log => (
                                                    <div key={log.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 group/log">
                                                        <span className="text-gray-300 text-sm">
                                                            <span className="text-white font-medium">{log.sets}</span> × <span className="text-white font-medium">{log.reps}</span> @ <span className="text-purple-300 font-medium">{log.weight_kg}kg</span>
                                                            {log.notes && <span className="text-gray-500 ml-2">— {log.notes}</span>}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-600 text-xs">{(log.logged_at || log.created || '').substring(0, 10)}</span>
                                                            <button onClick={() => deleteLog(log.id, exercise.id)} className="opacity-0 group-hover/log:opacity-100 p-1 rounded text-red-500/60 hover:text-red-400 transition-all">
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={() => toggleChart(exercise.id)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-4">
                                        <BarChart2 className="w-4 h-4" />
                                        {isChartOpen ? 'Hide Progress' : 'View Progress'}
                                        {isChartOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    {isChartOpen && chart.length >= 2 && (
                                        <div className="bg-black/20 rounded-xl p-4 mb-4">
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={chart}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                                    <XAxis dataKey="logged_at" tickFormatter={v => v.substring(0, 10)} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelFormatter={v => v.substring(0, 10)} />
                                                    <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                                                    <Line type="monotone" dataKey="weight_kg" stroke="#a855f7" strokeWidth={2} name="Weight (kg)" dot={{ r: 3, fill: '#a855f7' }} />
                                                    <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} name="Volume" dot={{ r: 3, fill: '#6366f1' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                    {isChartOpen && chart.length < 2 && (
                                        <p className="text-sm text-gray-600 mb-4 bg-white/5 rounded-lg px-3 py-2">Record at least 2 workouts to see a chart.</p>
                                    )}

                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                        <button
                                            onClick={() => toggleLogForm(exercise.id, exercise)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isLogOpen ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                                        >
                                            <ClipboardList className="w-4 h-4" />
                                            {isLogOpen ? 'Cancel' : 'Track Sets'}
                                        </button>
                                        <button
                                            onClick={() => { setShowAddForm(false); setEditingExercise(exercise); }}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteExercise(exercise.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-all ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WorkoutDetailPage;
