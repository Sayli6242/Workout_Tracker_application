import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash2, Pencil, X, Layers } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

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

const SectionPage = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [folderName, setFolderName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        fetchFolderDetails();
        fetchSections();
    }, [folderId]);

    const fetchFolderDetails = async () => {
        try {
            const response = await axios.get(`/folders/${folderId}`);
            setFolderName(response.data.name);
        } catch (error) {
            console.error('Error fetching folder details:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`/folders/${folderId}/sections/`);
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const createSection = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/folders/${folderId}/sections/`, {
                name: newSectionName,
                description: newSectionDescription,
            });
            setSections([...sections, response.data]);
            setNewSectionName('');
            setNewSectionDescription('');
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };

    const updateSection = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/folders/${folderId}/sections/${selectedSection.id}/`, {
                name: editedName,
                description: editedDescription,
            });
            setSections(sections.map(s =>
                s.id === selectedSection.id ? { ...s, name: editedName, description: editedDescription } : s
            ));
            setShowUpdateModal(false);
            setSelectedSection(null);
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    const deleteSection = async (id) => {
        try {
            await axios.delete(`/folders/${folderId}/sections/${id}/`);
            setSections(sections.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const sectionColors = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-indigo-600',
        'from-teal-500 to-cyan-600',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
        'from-lime-500 to-green-600',
    ];

    return (
        <div className="min-h-screen bg-[#0d0d17] text-white lg:ml-60 pt-14 lg:pt-0">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/folders')}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Folders
                        </button>
                        <h1 className="text-3xl font-bold text-white">{folderName || 'Loading...'}</h1>
                        <p className="text-gray-500 mt-1">{sections.length} section{sections.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition-all w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        New Section
                    </button>
                </div>

                {sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <Layers className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No sections yet</p>
                        <p className="text-gray-600 text-sm">Add a section to organise your exercises</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sections.map((section, idx) => {
                            const grad = sectionColors[idx % sectionColors.length];
                            return (
                                <div
                                    key={section.id}
                                    onClick={() => navigate(`/folders/${folderId}/sections/${section.id}/exercises`)}
                                    className="group bg-[#1a1a2e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-purple-500/30 hover:bg-[#1e1e35] transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${grad}`} />
                                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${grad} mb-3 shadow-md`}>
                                        <Layers className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-white font-semibold text-base mb-1 pr-16">{section.name}</h3>
                                    {section.description && (
                                        <p className="text-gray-500 text-xs line-clamp-2">{section.description}</p>
                                    )}
                                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedSection(section);
                                                setEditedName(section.name);
                                                setEditedDescription(section.description || '');
                                                setShowUpdateModal(true);
                                            }}
                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
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

            {showCreateModal && (
                <Modal title="Create Section" onClose={() => setShowCreateModal(false)}>
                    <form onSubmit={createSection} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Section Name</label>
                            <input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)}
                                placeholder="e.g. Chest, Warm Up..." autoFocus required
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description <span className="text-gray-500">(optional)</span></label>
                            <textarea value={newSectionDescription} onChange={e => setNewSectionDescription(e.target.value)} rows="2"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none" />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Create</button>
                        </div>
                    </form>
                </Modal>
            )}

            {showUpdateModal && (
                <Modal title="Edit Section" onClose={() => setShowUpdateModal(false)}>
                    <form onSubmit={updateSection} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Section Name</label>
                            <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} autoFocus required
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description <span className="text-gray-500">(optional)</span></label>
                            <textarea value={editedDescription} onChange={e => setEditedDescription(e.target.value)} rows="2"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none" />
                        </div>
                        <div className="flex gap-3 justify-end pt-1">
                            <button type="button" onClick={() => setShowUpdateModal(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-medium text-sm shadow-md transition-all">Save</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default SectionPage;
