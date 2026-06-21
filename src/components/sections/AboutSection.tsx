import React, { useState } from 'react';
import { useEditMode } from '../../hooks/useEditMode';
import { Edit2, Check, X } from 'lucide-react';

interface AboutSectionProps {
  bio: string;
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (bio: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  bio,
  isOwner,
  editMode,
  onUpdate,
  title = 'About',
  onTitleChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localBio, setLocalBio] = useState(bio);
  const [localTitle, setLocalTitle] = useState(title);

  const handleSave = () => {
    onUpdate(localBio);
    setIsEditing(false);
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
            />
          </div>
        ) : (
          <span>{localTitle}</span>
        )}
        {isOwner && editMode && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="card-content">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
              placeholder="Tell your story..."
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setLocalBio(bio);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {bio || (isOwner ? 'Click the edit icon to add your story...' : 'No about information provided.')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AboutSection;