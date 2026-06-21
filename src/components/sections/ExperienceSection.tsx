import React, { useState } from 'react';
import { Experience } from '../../types/profile';
import { useEditMode } from '../../hooks/useEditMode';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: Experience[];
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (experiences: Experience[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isOwner,
  editMode,
  onUpdate,
  title = 'Experience',
  onTitleChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExp, setNewExp] = useState<Experience>({ company: '', role: '', duration: '' });
  const [editingExp, setEditingExp] = useState<Experience>({ company: '', role: '', duration: '' });
  const [localTitle, setLocalTitle] = useState(title);

  const handleAdd = () => {
    if (newExp.company && newExp.role) {
      onUpdate([...experiences, newExp]);
      setNewExp({ company: '', role: '', duration: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (index: number) => {
    onUpdate(experiences.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingExp({ ...experiences[index] });
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...experiences];
    updated[index] = editingExp;
    onUpdate(updated);
    setEditingIndex(null);
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
        {isOwner && editMode && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card-content">
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your experience' : 'No experience added'}
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item group relative">
                {editingIndex === index ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingExp.company}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Company"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editingExp.role}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Role"
                    />
                    <input
                      type="text"
                      value={editingExp.duration}
                      onChange={(e) => setEditingExp({ ...editingExp, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Duration (e.g., 2020-2023)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {exp.role}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {exp.company}
                        </div>
                        <div className="text-sm text-gray-500">{exp.duration}</div>
                      </div>
                      {isOwner && editMode && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-1 text-blue-500 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="space-y-3">
              <input
                type="text"
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                placeholder="Company name"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                placeholder="Your role"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                placeholder="Duration (e.g., 2020-2023)"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;