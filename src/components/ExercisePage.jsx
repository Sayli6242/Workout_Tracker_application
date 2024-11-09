import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ExercisePage = () => {
    const { folderId, sectionId } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchSectionDetails();
        fetchExercises();
    }, [sectionId]);

    const fetchSectionDetails = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections/${sectionId}`);
            console.log(response.data);

            const sectionName = response.data[0].title;
            // console.log(response.data[0].name);
            setSectionName(sectionName);
        } catch (error) {
            console.error('Error fetching section details:', error);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axios.get(`/api/folders/${folderId}/sections/${sectionId}/exercises`);
            console.log(response.data);
            setExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const createExercises = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const exerciseData = {
                title: newExerciseName,
                media_url: "placeholder", // We'll update this after upload
                section_id: sectionId,
                folder_id: folderId,
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
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setExercises([...exercises, response.data]);
            setNewExerciseName('');
            setSelectedImage(null);
            setDescription('');
        } catch (error) {
            console.error('Error creating exercise:', error);

        }
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

                <h1 className="text-2xl font-bold text-gray-900 mb-2">{sectionName}</h1>
                {/* <p className="text-gray-600 mb-6">Manage exercises in this section</p> */}

                <form onSubmit={createExercises} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newExerciseName}
                            onChange={(e) => setNewExerciseName(e.target.value)}
                            placeholder="Enter exercise name"
                            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                        <label className="flex items-center space-x-2">
                            <input
                                type="file"
                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                className="sr-only"
                            />
                            <span className="text-gray-600">Upload image</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter exercise description"
                            className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    {exercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
                            {exercise.image && <img src={exercise.image.url} alt={exercise.title} className="w-full my-4" />}
                            <p className="text-sm">{exercise.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExercisePage;
