import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, X, ChevronDown, ChevronUp, Trophy, BarChart2, Trash2, Pencil, Dumbbell, ClipboardList } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

const PB_URL = 'http://127.0.0.1:8090';

const getImageUrl = (exercise) => {
    if (exercise.image) return `${PB_URL}/api/files/${exercise.collectionId}/${exercise.id}/${exercise.image}`;
    if (exercise.image_url) return exercise.image_url;
    return null;
};

const Modal = ({ title, onClose, children, wide }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full ${wide ? 'max-w-lg' : 'max-w-md'} shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

const inputCls = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30";
const labelCls = "block text-sm font-medium text-gray-300 mb-1.5";

const ExercisePage = () => {
    const { folderId, sectionId } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [sectionName, setSectionName] = useState('');

    // Create/edit exercise
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Log workout
    const [logModalExercise, setLogModalExercise] = useState(null);
    const [logSets, setLogSets] = useState('');
    const [logReps, setLogReps] = useState('');
    const [logWeight, setLogWeight] = useState('');
    const [logNotes, setLogNotes] = useState('');

    // Per-exercise data
    const [exerciseLogs, setExerciseLogs] = useState({});
    const [exercisePRs, setExercisePRs] = useState({});
    const [chartData, setChartData] = useState({});
    const [showChart, setShowChart] = useState({});

    useEffect(() => {
        fetchSectionDetails();
        fetchExercises();
    }, [folderId, sectionId]);

    const fetchSectionDetails = async () => {
        try {
            const r = await axios.get(`/folders/${folderId}/sections/${sectionId}/`);
            setSectionName(r.data.name);
        } catch (e) { console.error(e); }
    };

    const fetchExercises = async () => {
        try {
            const r = await axios.get(`/folders/${folderId}/sections/${sectionId}/exercises/`);
            setExercises(r.data);
            r.data.forEach(ex => {
                fetchExerciseLogs(ex.id);
                fetchExercisePR(ex.id);
            });
        } catch (e) { console.error(e); }
    };

    const fetchExerciseLogs = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/?exercise_id=${id}`);
            setExerciseLogs(prev => ({ ...prev, [id]: r.data }));
        } catch (e) { console.error(e); }
    };

    const fetchExercisePR = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/pr/?exercise_id=${id}`);
            setExercisePRs(prev => ({ ...prev, [id]: r.data }));
        } catch (e) { console.error(e); }
    };

    const fetchChartData = async (id) => {
        try {
            const r = await axios.get(`/exercise-logs/chart/?exercise_id=${id}`);
            setChartData(prev => ({ ...prev, [id]: r.data }));
        } catch (e) { console.error(e); }
    };

    const toggleChart = (id) => {
        const next = !showChart[id];
        setShowChart(prev => ({ ...prev, [id]: next }));
        if (next && !chartData[id]) fetchChartData(id);
    };

    const resetForm = () => { setNewExerciseName(''); setDescription(''); setSelectedImage(null); setEditingExercise(null); };

    const createExercise = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', newExerciseName);
        fd.append('description', description || '');
        if (selectedImage) fd.append('image', selectedImage);
        try {
            await axios.post(`/folders/${folderId}/sections/${sectionId}/exercises/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            fetchExercises(); resetForm(); setIsModalOpen(false);
        } catch (e) { console.error(e); }
    };

    const updateExercise = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', newExerciseName);
        fd.append('description', description || '');
        if (selectedImage) fd.append('image', selectedImage);
        try {
            await axios.put(`/folders/${folderId}/sections/${sectionId}/exercises/${editingExercise.id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            fetchExercises(); resetForm(); setIsModalOpen(false);
        } catch (e) { console.error(e); }
    };

    const deleteExercise = async (id) => {
        try {
            await axios.delete(`/folders/${folderId}/sections/${sectionId}/exercises/${id}/`);
            setExercises(exercises.filter(ex => ex.id !== id));
        } catch (e) { console.error(e); }
    };

    const submitLog = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/exercise-logs/', {
                exercise_id: logModalExercise.id,
                sets: parseInt(logSets),
                reps: parseInt(logReps),
                weight_kg: parseFloat(logWeight),
                notes: logNotes,
                logged_at: new Date().toISOString(),
            });
            fetchExerciseLogs(logModalExercise.id);
            fetchExercisePR(logModalExercise.id);
            if (showChart[logModalExercise.id]) fetchChartData(logModalExercise.id);
            setLogModalExercise(null);
        } catch (e) { console.error(e); }
    };

    const deleteLog = async (logId, exerciseId) => {
        try {
            await axios.delete(`/exercise-logs/${logId}/`);
            fetchExerciseLogs(exerciseId);
            fetchExercisePR(exerciseId);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 lg:pt-0">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate(`/folders/${folderId}/sections`)}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sections
                        </button>
                        <h1 className="text-3xl font-bold text-white">{sectionName || 'Loading...'}</h1>
                        <p className="text-gray-500 mt-1">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                    </button>
                </div>

                {/* Exercise cards */}
                {exercises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Dumbbell className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No exercises yet</p>
                        <p className="text-gray-600 text-sm">Add your first exercise to this section</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exercises.map(exercise => {
                            const pr = exercisePRs[exercise.id];
                            const logs = exerciseLogs[exercise.id] || [];
                            const chart = chartData[exercise.id] || [];
                            const isChartOpen = showChart[exercise.id];

                            return (
                                <div key={exercise.id} className="bg-[#1a1a2e] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all duration-300">
                                    {/* Top accent */}
                                    <div className="h-0.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />

                                    <div className="p-6">
                                        {/* Title row */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-md">
                                                    <Dumbbell className="w-5 h-5 text-white" />
                                                </div>
                                                <h2 className="text-xl font-semibold text-white">{exercise.name}</h2>
                                            </div>
                                            {pr && pr.max_weight_kg > 0 && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg shrink-0">
                                                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                                    <span className="text-yellow-300 text-xs font-medium">
                                                        {pr.max_weight_kg}kg × {pr.max_reps} reps
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image */}
                                        {getImageUrl(exercise) && (
                                            <img
                                                src={getImageUrl(exercise)}
                                                alt={exercise.name}
                                                className="w-full max-h-80 object-contain rounded-xl bg-black/20 mb-4"
                                            />
                                        )}

                                        {/* Description */}
                                        {exercise.description && (
                                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exercise.description}</p>
                                        )}

                                        {/* Recent logs */}
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
                                                                <span className="text-white font-medium">{log.sets}</span> sets ×{' '}
                                                                <span className="text-white font-medium">{log.reps}</span> reps @{' '}
                                                                <span className="text-purple-300 font-medium">{log.weight_kg}kg</span>
                                                                {log.notes && <span className="text-gray-500 ml-2">— {log.notes}</span>}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-600 text-xs">{(log.logged_at || log.created || '').substring(0, 10)}</span>
                                                                <button
                                                                    onClick={() => deleteLog(log.id, exercise.id)}
                                                                    className="opacity-0 group-hover/log:opacity-100 p-1 rounded text-red-500/60 hover:text-red-400 transition-all"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Progress chart toggle */}
                                        <button
                                            onClick={() => toggleChart(exercise.id)}
                                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-4"
                                        >
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
                                                        <Tooltip
                                                            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                                                            labelStyle={{ color: '#e5e7eb' }}
                                                            labelFormatter={v => v.substring(0, 10)}
                                                        />
                                                        <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
                                                        <Line type="monotone" dataKey="weight_kg" stroke="#a855f7" strokeWidth={2} name="Weight (kg)" dot={{ r: 3, fill: '#a855f7' }} />
                                                        <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} name="Volume" dot={{ r: 3, fill: '#6366f1' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                        {isChartOpen && chart.length < 2 && (
                                            <p className="text-sm text-gray-600 mb-4 bg-white/5 rounded-lg px-3 py-2">Record at least 2 workouts to see a progress chart.</p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                            <button
                                                onClick={() => {
                                                    setLogModalExercise(exercise);
                                                    setLogSets(''); setLogReps(''); setLogWeight(''); setLogNotes('');
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-lg text-sm font-medium transition-all"
                                            >
                                                <ClipboardList className="w-4 h-4" />
                                                Track Sets
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingExercise(exercise);
                                                    setNewExerciseName(exercise.name);
                                                    setDescription(exercise.description || '');
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteExercise(exercise.id)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-sm font-medium transition-all ml-auto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create / Edit Exercise Modal */}
            {isModalOpen && (
                <Modal title={editingExercise ? 'Edit Exercise' : 'Add Exercise'} onClose={() => { setIsModalOpen(false); resetForm(); }}>
                    <form onSubmit={editingExercise ? updateExercise : createExercise} className="space-y-4">
                        <div>
                            <label className={labelCls}>Exercise Name</label>
                            <input type="text" value={newExerciseName} onChange={e => setNewExerciseName(e.target.value)}
                                placeholder="e.g. Bench Press" required autoFocus className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Image <span className="text-gray-500">(optional)</span></label>
                            <input type="file" accept="image/*" onChange={e => setSelectedImage(e.target.files[0])}
                                className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/30 file:cursor-pointer" />
                        </div>
                        <div>
                            <label className={labelCls}>Description <span className="text-gray-500">(optional)</span></label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3"
                                placeholder="Notes on form, muscles targeted..." className={`${inputCls} resize-none`} />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit"
                                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">
                                {editingExercise ? 'Save Changes' : 'Add Exercise'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Log Workout Modal */}
            {logModalExercise && (
                <Modal title={`Track Sets — ${logModalExercise.name}`} onClose={() => setLogModalExercise(null)}>
                    <form onSubmit={submitLog} className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {[['Sets', logSets, setLogSets, '3'], ['Reps', logReps, setLogReps, '10'], ['Weight (kg)', logWeight, setLogWeight, '60']].map(([lbl, val, setter, ph]) => (
                                <div key={lbl}>
                                    <label className={labelCls}>{lbl}</label>
                                    <input type="number" min="0" step={lbl === 'Weight (kg)' ? '0.5' : '1'} value={val}
                                        onChange={e => setter(e.target.value)} placeholder={ph} required className={inputCls} />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className={labelCls}>Notes <span className="text-gray-500">(optional)</span></label>
                            <input type="text" value={logNotes} onChange={e => setLogNotes(e.target.value)}
                                placeholder="How did it feel?" className={inputCls} />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => setLogModalExercise(null)}
                                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit"
                                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ExercisePage;
