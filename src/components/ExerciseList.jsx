import React, { useState, useEffect } from 'react';
import Exercise from './ExercisePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

const ExerciseList = ({ sectionId }) => {
    const [exercises, setExercises] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchExercises();
    }, [sectionId]);

    const fetchExercises = async () => {
        try {
            const response = await fetch('http://localhost:8000/');
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const handleCreateExercise = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newExerciseName);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await fetch('http://localhost:8000/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newExercise = await response.json();
                setExercises([...exercises, newExercise]);
                setNewExerciseName('');
                setSelectedImage(null);
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Error creating exercise:', error);
        }
    };

    return (
        <div className="space-y-4">
            {isCreating ? (
                <div className="space-y-4">
                    <Input
                        type="text"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        placeholder="Exercise name"
                    />
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleCreateExercise}>Save</Button>
                        <Button variant="outline" onClick={() => setIsCreating(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                </Button>
            )}

            {exercises.map((exercise) => (
                <Exercise
                    key={exercise.id}
                    exercise={exercise}
                    sectionId={sectionId}
                    exercises={exercises}
                    setExercises={setExercises}
                />
            ))}
        </div>
    );
};

export default ExerciseList;