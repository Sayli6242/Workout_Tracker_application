import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Trash2, CalendarDays } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

const CalendarPage = () => {
    const navigate = useNavigate();
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [notes, setNotes] = useState('');
    const [dayLogs, setDayLogs] = useState([]);

    useEffect(() => {
        fetchWorkoutLogs();
        fetchFolders();
    }, []);

    const fetchWorkoutLogs = async () => {
        try {
            const res = await axios.get('/workout-logs/');
            setWorkoutLogs(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchFolders = async () => {
        try {
            const res = await axios.get('/folders/');
            setFolders(res.data);
        } catch (err) { console.error(err); }
    };

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const workedOutDates = new Set(workoutLogs.map(l => l.logged_date));

    const tileContent = ({ date, view }) => {
        if (view === 'month' && workedOutDates.has(formatDate(date))) {
            return (
                <div className="flex justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
            );
        }
        return null;
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        const dateStr = formatDate(date);
        setDayLogs(workoutLogs.filter(l => l.logged_date === dateStr));
    };

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        try {
            const folder = folders.find(f => f.id === selectedFolderId);
            const res = await axios.post('/workout-logs/', {
                folder_id: selectedFolderId,
                folder_name: folder ? folder.name : '',
                logged_date: formatDate(selectedDate),
                notes,
            });
            setIsModalOpen(false);
            const updated = [...workoutLogs, res.data];
            setWorkoutLogs(updated);
            setDayLogs(updated.filter(l => l.logged_date === formatDate(selectedDate)));
        } catch (err) { console.error(err); }
    };

    const handleDeleteLog = async (logId) => {
        try {
            await axios.delete(`/workout-logs/${logId}/`);
            const updated = workoutLogs.filter(l => l.id !== logId);
            setWorkoutLogs(updated);
            setDayLogs(updated.filter(l => l.logged_date === formatDate(selectedDate)));
        } catch (err) { console.error(err); }
    };

    const totalWorkouts = workoutLogs.length;
    const uniqueDays = workedOutDates.size;

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 pb-16 lg:pt-0 lg:pb-0">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                <CalendarDays className="w-7 h-7 text-purple-400" />
                                Workout Calendar
                            </h1>
                        </div>
                        <p className="text-gray-500 mt-1 ml-1">
                            <span className="text-emerald-400 font-medium">{uniqueDays}</span> active days &nbsp;·&nbsp;
                            <span className="text-purple-400 font-medium">{totalWorkouts}</span> total entries
                        </p>
                    </div>
                    <button
                        onClick={() => { setNotes(''); setSelectedFolderId(''); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all w-full sm:w-auto"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Mark Workout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-3 bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
                        <style>{`
                            .react-calendar { background: transparent !important; border: none !important; color: white; width: 100% !important; font-family: inherit; }
                            .react-calendar__navigation button { color: #e5e7eb; background: transparent; font-size: 16px; }
                            .react-calendar__navigation button:hover { background: rgba(255,255,255,0.08) !important; border-radius: 8px; }
                            .react-calendar__navigation button:disabled { background: transparent !important; color: #4b5563; }
                            .react-calendar__month-view__weekdays__weekday { color: #6b7280; font-size: 12px; }
                            .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                            .react-calendar__tile { color: #d1d5db; padding: 8px 4px; border-radius: 8px; transition: all 0.15s; }
                            .react-calendar__tile:hover { background: rgba(255,255,255,0.08) !important; color: white; }
                            .react-calendar__tile--active { background: linear-gradient(135deg, #7c3aed, #6d28d9) !important; color: white !important; border-radius: 8px; }
                            .react-calendar__tile--now { background: rgba(124,58,237,0.15) !important; color: #a78bfa !important; border-radius: 8px; }
                            .react-calendar__tile--active.react-calendar__tile--now { background: linear-gradient(135deg, #7c3aed, #6d28d9) !important; color: white !important; }
                            .react-calendar__month-view__days__day--neighboringMonth { color: #374151; }
                        `}</style>
                        <Calendar
                            onChange={handleDayClick}
                            value={selectedDate}
                            tileContent={tileContent}
                        />
                    </div>

                    {/* Day detail panel */}
                    <div className="lg:col-span-2 bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
                        <h2 className="text-base font-semibold text-white mb-1">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                        <p className="text-gray-500 text-xs mb-4">{selectedDate.getFullYear()}</p>

                        {dayLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CalendarDays className="w-10 h-10 text-gray-700 mb-3" />
                                <p className="text-gray-500 text-sm">No workouts on this day</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {dayLogs.map(log => (
                                    <div key={log.id} className="flex items-start justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl group">
                                        <div>
                                            <p className="font-medium text-emerald-300 text-sm">{log.folder_name}</p>
                                            {log.notes && <p className="text-gray-400 text-xs mt-0.5">{log.notes}</p>}
                                        </div>
                                        <button onClick={() => handleDeleteLog(log.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400/60 hover:text-red-400 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-white">Add Workout</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <form onSubmit={handleSubmitLog} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Folder / Workout</label>
                                <select value={selectedFolderId} onChange={e => setSelectedFolderId(e.target.value)} required
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30">
                                    <option value="" className="bg-[#1a1a2e]">Select a folder</option>
                                    {folders.map(f => <option key={f.id} value={f.id} className="bg-[#1a1a2e]">{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes <span className="text-gray-500">(optional)</span></label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="2"
                                    placeholder="How did it go?" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none" />
                            </div>
                            <div className="flex gap-3 justify-end pt-1">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
