import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash, Edit } from 'lucide-react';
import { FolderPlus } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { authStyles } from '../components/styles/constants';

// // Change the import from
// import axios from 'axios';
// // to
import axios from '../lib/axiosConfig';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};


const FoldersPage = () => {
    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    // const [newFolderDescription, setNewFolderDescription] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await axios.get('/api/folders/');
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const createFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/folders/', {
                name: newFolderName,
                // description: newFolderDescription
            }, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });
            setFolders([...folders, response.data]);
            setNewFolderName('');
            // setNewFolderDescription('');
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error creating folder:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };
    const updateFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/folders/${editingFolder.id}/`, {
                name: editingFolder.name,
                // description: editingFolder.description  // Include description if your backend expects it
            }, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`  // Add authorization header
                }
            });

            if (response.data) {
                setFolders(folders.map(folder =>
                    folder.id === editingFolder.id
                        ? { ...folder, ...response.data }  // Use response data instead of editingFolder
                        : folder
                ));
                setIsEditModalOpen(false);
                setEditingFolder(null);
            }
        } catch (error) {
            console.error('Error updating folder:', error);
            if (error.response?.status === 401) {
                navigate('/login');  // Handle unauthorized access
            }
        }
    };


    const deleteFolder = async (id) => {
        try {
            await axios.delete(`/api/folders/${id}/`);
            setFolders(folders.filter(folder => folder.id !== id));
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    const handleEditClick = (e, folder) => {
        e.stopPropagation();
        setEditingFolder(folder);
        setIsEditModalOpen(true);
    };

    return (
        <div className="bg-cover bg-no-repeat bg-center" style={{ backgroundImage: authStyles.backgroundImage }}>

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/Home')}
                        className="mb-6 inline-flex items-center text-[#A0522D] hover:text-[#D2691E] rounded-lg border border-[#A0522D] hover:border-[#D2691E] px-4 py-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Folders</h1>


                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <FolderPlus className="w-5 h-5 mr-2" />
                        Create Folder
                    </button>

                    <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                        <h2 className="text-xl font-bold mb-4">Create New Folder</h2>
                        <form onSubmit={createFolder}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Folder Name
                                </label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newFolderDescription}
                                    onChange={(e) => setNewFolderDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                />
                            </div> */}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Create
                            </button>
                        </form>
                    </Modal>

                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <h2 className="text-xl font-bold mb-4">Edit Folder</h2>
                        <form onSubmit={updateFolder}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Folder Name
                                </label>
                                <input
                                    type="text"
                                    value={editingFolder?.name || ''}
                                    onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editingFolder?.description || ''}
                                    onChange={(e) => setEditingFolder({ ...editingFolder, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                />
                            </div> */}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Update
                            </button>
                        </form>
                    </Modal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                onClick={() => navigate(`/folders/${folder.id}/sections`)}
                            >
                                <h3 className="text-lg font-semibold text-gray-900">{folder.name}</h3>
                                {/* <p className="text-gray-500 text-sm mt-2">{folder.description}</p> */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        type="button"
                                        className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-600 transition-colors"
                                        onClick={(e) => handleEditClick(e, folder)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFolder(folder.id);
                                        }}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoldersPage;