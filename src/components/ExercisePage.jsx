import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, X } from 'lucide-react';
import axios from 'axios';

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
    }, [sectionId]);

    const fetchSectionDetails = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections/${sectionId}`);
            setSectionName(response.data.name); // Updated to directly access name
        } catch (error) {
            console.error('Error fetching section details:', error);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections/${sectionId}/exercises`);
            const exercisesWithImages = await Promise.all(
                response.data.map(async (exercise) => {
                    try {
                        // Fetch image for each exercise
                        const imageResponse = await axios.get(
                            `/api/exercises/${exercise.id}/image`,
                            // console.log(`Fetching image for exercise ${exercise.id}`),
                            { responseType: 'blob' }
                        );
                        exercise.imageUrl = URL.createObjectURL(imageResponse.data);
                    } catch (error) {
                        console.error('Error fetching exercise image:', error);
                        exercise.imageUrl = null;
                    }
                    return exercise;
                })
            );
            setExercises(exercisesWithImages);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const createExercise = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const exerciseData = {
                title: newExerciseName,
                description: description
            };

            formData.append('exercise', JSON.stringify(exerciseData));
            if (selectedImage) {
                formData.append('uploaded_image', selectedImage);
            }

            const response = await axios.post(
                `/api/folders/${folderId}/sections/${sectionId}/exercises`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            await fetchExercises();
            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating exercise:', error);
        }
    };

    /*************  ✨ Codeium Command 🌟  *************/
    const updateExercise = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const exerciseData = {
                title: newExerciseName,
                description: description
            };

            formData.append('exercise', JSON.stringify(exerciseData));
            if (selectedImage) {
                formData.append('uploaded_image', selectedImage);
                await axios.put(
                    `/api/exercises/${editingExercise.id}/image`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
            }

            await axios.put(
                `/api/folders/${folderId}/sections/${sectionId}/exercises/${editingExercise.id}`,
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


    /******  d1e1c771-3088-470e-83a4-95e136fe4947  *******/

    const deleteExercise = async (exerciseId) => {
        try {
            await axios.delete(`/api/folders/${folderId}/sections/${sectionId}/exercises/${exerciseId}`);
            setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
        } catch (error) {
            console.error('Error deleting exercise:', error);
        }
    };

    const startUpdateExercise = (exercise) => {

        if (!exercise || !exercise.id) {
            console.error('Invalid exercise data for update');
            return;
        }
        setEditingExercise({
            id: exercise.id,
            title: exercise.title,
            description: exercise.description
        });


        setNewExerciseName(exercise.title);
        setDescription(exercise.description);
        // setEditingExercise(exercise);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setNewExerciseName('');
        setSelectedImage(null);
        setDescription('');
        setEditingExercise(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(`/folders/${folderId}/sections`)}
                    className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sections
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Section: {sectionName}
                </h1>

                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="mb-8 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        {editingExercise ? "Update Exercise" : "Create Exercise"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
                            {exercise.imageUrl && (
                                <img
                                    src={exercise.imageUrl}
                                    alt={exercise.title}
                                    className="w-full max-h-64 object-contain my-4"
                                />
                            )}
                            <p className="text-gray-600 mt-2">{exercise.description}</p>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => deleteExercise(exercise.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => startUpdateExercise(exercise)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExercisePage;
