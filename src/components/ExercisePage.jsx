import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, X } from 'lucide-react';
import axios from '../lib/axiosConfig';
import { useAuth } from '../components/auth/AuthContext';
import { authStyles } from '../components/styles/constants';
import Navbar from './Navbar';  // Add this import

const ExercisePage = () => {
    const { folderId, sectionId } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);

    useEffect(() => {
        fetchSectionDetails();
        fetchExercises();
    }, [folderId, sectionId]);
    const fetchSectionDetails = async () => {
        try {
            const response = await axios.get(`/folders/${folderId}/sections/${sectionId}/`);
            setSectionName(response.data.name);
        } catch (error) {
            console.error('Error fetching section details:', error);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axios.get(
                `/folders/${folderId}/sections/${sectionId}/exercises/`
            );
            setExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const createExercise = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newExerciseName);
            formData.append('description', description || '');
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.post(
                `/folders/${folderId}/sections/${sectionId}/exercises/`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            fetchExercises();
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating exercise:', error);
        }
    };

    const startEditExercise = (exercise) => {
        setEditingExercise(exercise);
        setNewExerciseName(exercise.name);
        setDescription(exercise.description || '');
        setIsModalOpen(true);
    };

    const updateExercise = async (e) => {
        e.preventDefault();
        if (!editingExercise) return;

        try {
            const formData = new FormData();
            formData.append('name', newExerciseName);
            formData.append('description', description || '');
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.put(
                `/folders/${folderId}/sections/${sectionId}/exercises/${editingExercise.id}/`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            await fetchExercises();
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating exercise:', error);
        }
    };

    const deleteExercise = async (exerciseId) => {
        try {
            await axios.delete(
                `/folders/${folderId}/sections/${sectionId}/exercises/${exerciseId}/`
            );
            setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const resetForm = () => {
        setNewExerciseName('');
        setSelectedImage(null);
        setDescription('');
        setEditingExercise(null);
    };

    return (
        <>
            <Navbar />

            <div className="bg-cover bg-no-repeat bg-center" style={{ backgroundImage: authStyles.backgroundImage }}>

                <div className="min-h-screen bg-gray-50 p-6 bg-opacity-50">
                    <div className="max-w-4xl mx-auto">

                        <button
                            onClick={() => navigate(`/folders/${folderId}/sections`)}
                            className="mb-6 inline-flex items-center text-[#A0522D] hover:text-[#D2691E] rounded-lg border border-[#A0522D] hover:border-[#D2691E] px-4 py-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sections
                        </button>
                        {/* <div className="mb-6 border-b border-[#D2691E] ">
                        <h1 className="text-3xl font-serif font-bold text-gray-900">
                            Section: <span className="font-normal">{sectionName || 'Loading...'}</span>
                        </h1>
                        <p className="text-gray-600 mt-1">Create and manage exercises for this section</p>
                    </div> */}

                        <div className="mb-6 border-b border-black dark:border-white">
                            <h1 className="text-3xl font-serif font-bold text-black dark:text-white">
                                Section : <span className="font-normal">{sectionName || 'Loading...'}</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1"></p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow mb-6"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </button>

                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">
                                            {editingExercise ? "Update Exercise" : "Create New Exercise"}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                resetForm();
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={editingExercise ? updateExercise : createExercise}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Exercise Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newExerciseName}
                                                onChange={(e) => setNewExerciseName(e.target.value)}
                                                placeholder="Enter exercise name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Upload Image
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                                className="w-full"
                                                accept="image/*"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Enter exercise description"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                rows="4"
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsModalOpen(false);
                                                    resetForm();
                                                }}
                                                className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-md shadow-lg hover:shadow-xl transition-shadow hover:bg-gradient-to-r hover:from-[#663399] hover:to-[#B300FF]"
                                            >
                                                {editingExercise ? "Update Exercise" : "Create Exercise"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <div className="space-y-8">
                            {exercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="bg-white p-12 rounded-lg shadow-md"
                                >
                                    <h2 className="text-3xl font-semibold text-gray-900">{exercise.name}</h2>
                                    {exercise.image_url && (
                                        <img
                                            src={exercise.image_url}
                                            alt={exercise.name}
                                            className="w-full max-h-[450px] object-contain my-10"
                                        />
                                    )}
                                    <p className="text-2xl text-gray-600 mt-6">{exercise.description}</p>

                                    <div className="flex justify-end space-x-3 mt-10">
                                        <button
                                            onClick={() => deleteExercise(exercise.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => startEditExercise(exercise)}
                                            className="px-6 py-3 bg-gradient-to-r from-[#794BC4] to-[#8F5E99] text-white rounded-md shadow-lg hover:shadow-xl transition-shadow hover:bg-gradient-to-r hover:from-[#663399] hover:to-[#B300FF]"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </>

    );
};

export default ExercisePage;