import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash } from 'lucide-react';
import axios from 'axios';

const FoldersPage = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await axios.get('/api/folders/');
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const createFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/folders', { name: newFolderName });
            setFolders([...folders, response.data]);
            setNewFolderName('');
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const deleteFolder = async (folderId) => {
        try {
            await axios.delete(`/api/folders/${folderId}`);
            setFolders(folders.filter(folder => folder.id !== folderId));
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Folders</h1>

                <form onSubmit={createFolder} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Folder
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                            onClick={() => navigate(`/folders/${folder.id}/sections`)}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{folder.name}</h3>
                            <p className="text-gray-500 text-sm mt-2">Click to view sections</p>
                            <button
                                type="button"
                                className="absolute top-4 right-4 p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFolder(folder.id);
                                }}
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

export default FoldersPage;