import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash2, Pencil, FolderOpen, X, Folder } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import Navbar, { saveRecentFolder } from './Navbar';
import axiosInstance from '../lib/axiosConfig';

const FoldersPage = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => { fetchFolders(); }, []);

    const fetchFolders = async () => {
        try {
            const response = await axiosInstance.get('/folders/');
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const createFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/folders/', { name: newFolderName });
            setFolders([...folders, response.data]);
            setNewFolderName('');
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const updateFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put(`/folders/${editingFolder.id}/`, { name: editingFolder.name });
            if (response.data) {
                setFolders(folders.map(f => f.id === editingFolder.id ? { ...f, ...response.data } : f));
                setIsEditModalOpen(false);
                setEditingFolder(null);
            }
        } catch (error) {
            console.error('Error updating folder:', error);
        }
    };

    const deleteFolder = async (id) => {
        try {
            await axiosInstance.delete(`/folders/${id}/`);
            setFolders(folders.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    const folderColors = [
        'from-purple-500 to-violet-600',
        'from-pink-500 to-rose-600',
        'from-blue-500 to-cyan-600',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-amber-600',
        'from-fuchsia-500 to-purple-600',
    ];

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 lg:pt-0">
            <Navbar />

            {/* Fixed glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/Home')}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </button>
                        <h1 className="text-3xl font-bold text-white">Your Folders</h1>
                        <p className="text-gray-500 mt-1">{folders.length} folder{folders.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        New Folder
                    </button>
                </div>

                {/* Folder grid */}
                {folders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Folder className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No folders yet</p>
                        <p className="text-gray-600 text-sm">Create your first folder to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder, idx) => {
                            const grad = folderColors[idx % folderColors.length];
                            return (
                                <div
                                    key={folder.id}
                                    onClick={() => { saveRecentFolder(folder.id, folder.name); navigate(`/folders/${folder.id}/sections`); }}
                                    className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Accent top bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${grad}`} />

                                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${grad} mb-3 shadow-md`}>
                                        <FolderOpen className="w-5 h-5 text-white" />
                                    </div>

                                    <h3 className="text-white font-semibold text-lg mb-1 pr-16">{folder.name}</h3>
                                    <p className="text-gray-500 text-xs">Click to view sections</p>

                                    {/* Action buttons */}
                                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingFolder(folder);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFolder(folder.id);
                                            }}
                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <Modal title="Create New Folder" onClose={() => setIsCreateModalOpen(false)}>
                    <form onSubmit={createFolder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Folder Name</label>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="e.g. Push Day, Leg Day..."
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                                required autoFocus
                            />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Create</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <Modal title="Rename Folder" onClose={() => setIsEditModalOpen(false)}>
                    <form onSubmit={updateFolder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Folder Name</label>
                            <input
                                type="text"
                                value={editingFolder?.name || ''}
                                onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                                required autoFocus
                            />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Save</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
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

export default FoldersPage;
