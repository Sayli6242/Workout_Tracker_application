import React, { useState } from 'react';
import Section from './SectionPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SectionList = ({ selectedFolder, sections, setSections, newSectionName, setNewSectionName }) => {
    const [isCreatingSection, setIsCreatingSection] = useState(false);

    const createSection = async () => {
        // Implement create section logic...
        const newSection = { id: Math.random(), name: newSectionName };
        setSections((prevSections) => ({ ...prevSections, [selectedFolder]: [...(prevSections[selectedFolder] || []), newSection] }));
        setNewSectionName('');
        setIsCreatingSection(false);
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Sections</h2>

            {/* Create Section */}
            {isCreatingSection ? (
                <div className="flex gap-2 mb-4">
                    <Input
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="New Section Name"
                        className="max-w-xs"
                    />
                    <Button onClick={createSection}>Add Section</Button>
                    <Button onClick={() => setIsCreatingSection(false)}>Cancel</Button>
                </div>
            ) : (
                <Button onClick={() => setIsCreatingSection(true)}>Add Section</Button>
            )}

            {/* Sections List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections[selectedFolder]?.map((section) => (
                    <Section key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
};

export default SectionList;