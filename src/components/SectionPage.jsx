import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash, X, Edit } from 'lucide-react';
import axios from 'axios';

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

    useEffect(() => {
        fetchFolderDetails();
        fetchSections();
    }, [folderId]);

    const fetchFolderDetails = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}`);
            const folderName = response.data[0].name;
            setFolderName(folderName);
        } catch (error) {
            console.error('Error fetching folder details:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections`);
            console.log('fetched sections:', response.data);
            setSections(response.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const createSection = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/folders/${folderId}/section`, {
                name: newSectionName,
                description: newSectionDescription,
                folder_id: folderId
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
            await axios.put(`/api/folders/${folderId}/sections/${selectedSection.id}`, {
                name: editedName,
                description: editedDescription,
                folder_id: folderId
            });
            setSections(sections.map(section =>
                section.id === selectedSection.id
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

    const deleteSection = async (sectionId) => {
        try {
            await axios.delete(`/api/folders/${folderId}/sections/${sectionId}`);
            setSections(sections.filter(section => section.id !== sectionId));
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/folders')}
                    className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Folders
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Folder: {folderName}</h1>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="mb-8 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Section
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                            onClick={() => navigate(`/folders/${folderId}/sections/${section.id}/exercises`)}
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
                                        deleteSection(section.id);
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
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
    );
};

export default SectionPage;