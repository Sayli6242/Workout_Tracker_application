import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash } from 'lucide-react';
import axios from 'axios';

const SectionPage = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [folderName, setFolderName] = useState('');

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
                folder_id: folderId
            });
            setSections([...sections, response.data]);
            setNewSectionName('');
        } catch (error) {
            console.error('Error creating section:', error);
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

                <form onSubmit={createSection} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="Enter section name"
                            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Section
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <div
                            key={section._id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                            onClick={() => navigate(`/folders/${folderId}/sections/${section.id}/exercises`)}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h3>
                            <p className="text-gray-500 text-sm">Click to view exercises</p>
                            <button
                                type="button"
                                className="absolute top-4 right-4 p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSection(section.id);
                                }}
                                aria-label="Delete section"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionPage;