import React, { useState } from 'react';
import { Education } from '../../types/profile';
import { Plus, Edit2, Trash2, Check, X, GraduationCap } from 'lucide-react';

interface EducationSectionProps {
  educations: Education[];
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (educations: Education[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  isOwner,
  editMode,
  onUpdate,
  title = 'Education',
  onTitleChange,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEdu, setNewEdu] = useState<Education>({ institution: '', degree: '', year: '' });
  const [editingEdu, setEditingEdu] = useState<Education>({ institution: '', degree: '', year: '' });
  const [localTitle, setLocalTitle] = useState(title);

  const handleAdd = () => {
    if (newEdu.institution && newEdu.degree) {
      onUpdate([...educations, newEdu]);
      setNewEdu({ institution: '', degree: '', year: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (index: number) => {
    if (confirm('Delete this education entry?')) {
      onUpdate(educations.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingEdu({ ...educations[index] });
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...educations];
    updated[index] = editingEdu;
    onUpdate(updated);
    setEditingIndex(null);
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1970; y--) {
      years.push(y);
    }
    return years;
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode ? (
          <div className="flex items-center gap-2 flex-1">
            <GraduationCap className="w-5 h-5 text-blue-500" />
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
          <span className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            {localTitle}
          </span>
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
        {educations.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your education' : 'No education added'}
          </p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="timeline-item group relative">
                {editingIndex === index ? (
                  <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <input
                      type="text"
                      value={editingEdu.institution}
                      onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600"
                      placeholder="Institution"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editingEdu.degree}
                      onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600"
                      placeholder="Degree / Field of study"
                    />
                    <select
                      value={editingEdu.year}
                      onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600"
                    >
                      <option value="">Select year</option>
                      {getYearOptions().map((y) => (
                        <option key={y} value={y.toString()}>{y}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {edu.institution}
                      </div>
                      <div className="text-sm text-gray-500">{edu.year}</div>
                    </div>
                    {isOwner && editMode && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
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
                value={newEdu.institution}
                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                placeholder="Institution name"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <input
                type="text"
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                placeholder="Degree / Field of study"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <select
                value={newEdu.year}
                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              >
                <option value="">Select year</option>
                {getYearOptions().map((y) => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Education
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

export default EducationSection;