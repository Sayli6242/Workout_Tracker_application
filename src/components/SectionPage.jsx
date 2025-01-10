import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash, X, Edit } from 'lucide-react';
import axios from '../lib/axiosConfig';
import { useAuth } from '../components/auth/AuthContext';
import { authStyles } from '../components/styles/constants';
import FoldersPage from './FoldersPage';
import Navbar from './Navbar';

const SectionPage = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionDescription, setNewSectionDescription] = useState('');
    const [folderName, setFolderName] = useState('');
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const { session } = useAuth();

    useEffect(() => {
        fetchFolderDetails();
        fetchSections();
    }, [folderId]);

    const fetchFolderDetails = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            setFolderName(response.data.name);
        } catch (error) {
            console.error('Error fetching folder details:', error);
        }
    };

    // const fetchFolderDetails = async () => {
    //     try {
    //         const response = await axios.get(`/api/folders/`, { 
    //             headers: { 'Authorization': `Bearer ${session?.access_token}` } 
    //         });
    //         // Find the matching folder by ID
    //         const folder = response.data.find(folder => folder.id === folderId);
    //         if (folder) {
    //             setFolderName(folder.name);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching folder details:', error);
    //     }
    // };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections/`, { headers: { 'Authorization': `Bearer ${session?.access_token}` } });
            console.log('fetched sections:', response.data);
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const createSection = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/folders/${folderId}/sections/`, {
                name: newSectionName,
                description: newSectionDescription,
                id: folderId
            }, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
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
            await axios.put(`/api/folders/${folderId}/sections/${selectedSection.section_id}`, {
                name: editedName,
                description: editedDescription,
                folder_id: folderId
            }, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            setSections(sections.map(section =>
                section.section_id === selectedSection.section_id
                    ? { ...section, name: editedName, description: editedDescription }
                    : section
            ));
            setShowUpdateModal(false);
            setSelectedSection(null);
            setEditedName('');
            setEditedDescription('');
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    const deleteSection = async (section_id) => {
        try {
            await axios.delete(`/api/folders/${folderId}/sections/${section_id}`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            setSections(sections.filter(section => section.section_id !== section_id));
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const handleEditClick = (section) => {
        setSelectedSection(section);
        setEditedName(section.name);
        setEditedDescription(section.description || '');
        setShowUpdateModal(true);
    };

    return (
        <>
            <Navbar />
            <div className="bg-cover bg-no-repeat bg-center" style={{ backgroundImage: authStyles.backgroundImage }}>

                <div className="min-h-screen bg-gray-50 p-6 bg-opacity-50">            <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/folders')}
                        className="mb-6 inline-flex items-center text-[#A0522D] hover:text-[#D2691E] rounded-lg border border-[#A0522D] hover:border-[#D2691E] px-4 py-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Folders
                    </button>

                    <div className="mb-6 border-b border-black dark:border-white">
                        <h1 className="text-3xl font-serif font-bold text-black dark:text-white">
                            Folder : <span className="font-normal">{folderName || 'Loading...'}</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1"></p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow mb-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Section
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sections.map((section) => (
                            <div
                                key={section.section_id}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                onClick={() => navigate(`/folders/${folderId}/sections/${section.section_id}/exercises`)}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {section.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        type="button"
                                        className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(section);
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSection(section.section_id);
                                        }}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create Section Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Create New Section</h2>
                                    <button onClick={() => setShowCreateModal(false)} className="p-1">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={createSection}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Section Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newSectionName}
                                            onChange={(e) => setNewSectionName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={newSectionDescription}
                                            onChange={(e) => setNewSectionDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-md shadow-lg hover:shadow-xl transition-shadow hover:bg-gradient-to-r hover:from-[#663399] hover:to-[#B300FF]"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Update Section Modal */}
                    {showUpdateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Edit Section</h2>
                                    <button onClick={() => setShowUpdateModal(false)} className="p-1">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={updateSection}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Section Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowUpdateModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-md shadow-lg hover:shadow-xl transition-shadow hover:bg-gradient-to-r hover:from-[#663399] hover:to-[#B300FF]"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default SectionPage;