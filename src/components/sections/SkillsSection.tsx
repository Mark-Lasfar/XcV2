import React, { useState } from 'react';
import { Skill } from '../../types/profile';
import { useEditMode } from '../../hooks/useEditMode';
import { Plus, X, Edit2, Check, Trash2 } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[] | any; // ✅ قبول Array أو Object
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (skills: Skill[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

// ✅ دالة مساعدة لتحويل Object إلى Array
const toArray = (data: any): Skill[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.values(data);
  }
  return [];
};

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills: skillsProp,
  isOwner,
  editMode,
  onUpdate,
  title = 'Skills & Expertise',
  onTitleChange,
}) => {
  // ✅ تحويل البيانات إلى Array
  const skills = toArray(skillsProp);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', percentage: 50, icon: '' });
  const [editingSkill, setEditingSkill] = useState<Skill>({ name: '', percentage: 50, icon: '' });
  const [localTitle, setLocalTitle] = useState(title);

  const availableIcons = [
    'bxl-react', 'bxl-python', 'bxl-javascript', 'bxl-nodejs', 'bxl-mongodb',
    'bxl-html5', 'bxl-css3', 'bxl-git', 'bxl-github', 'bxl-docker',
    'bxl-aws', 'bxl-figma', 'bxl-typescript', 'bxl-postgresql', 'bxl-php',
  ];

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      onUpdate([...skills, { ...newSkill, percentage: Math.min(100, Math.max(0, newSkill.percentage)) }]);
      setNewSkill({ name: '', percentage: 50, icon: '' });
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = (index: number) => {
    onUpdate(skills.filter((_, i) => i !== index));
  };

  const handleEditSkill = (index: number) => {
    setEditingIndex(index);
    setEditingSkill({ ...skills[index] });
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...skills];
    updated[index] = { ...editingSkill, percentage: Math.min(100, Math.max(0, editingSkill.percentage)) };
    onUpdate(updated);
    setEditingIndex(null);
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  // ✅ عرض رسالة مختلفة إذا كانت المهارات فارغة
  const hasSkills = skills.length > 0;

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
            className="text-blue-500 hover:text-blue-600 transition"
            aria-label="Add skill"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card-content">
        {!hasSkills ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your skills' : 'No skills added'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="group relative flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="w-24 px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editingSkill.percentage}
                      onChange={(e) => setEditingSkill({ ...editingSkill, percentage: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                      min="0"
                      max="100"
                    />
                    <select
                      value={editingSkill.icon || ''}
                      onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                      className="px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                    >
                      <option value="">No icon</option>
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="text-green-500 hover:text-green-600 transition"
                      aria-label="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-gray-500 hover:text-gray-600 transition"
                      aria-label="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {skill.icon && (
                      <i className={`bx ${skill.icon} text-blue-500`} />
                    )}
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-xs text-gray-500">{skill.percentage}%</span>
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, skill.percentage))}%` }}
                      />
                    </div>
                    {isOwner && editMode && (
                      <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                        <button
                          onClick={() => handleEditSkill(index)}
                          className="p-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                          aria-label="Edit skill"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(index)}
                          className="p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                          aria-label="Delete skill"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Skill Form */}
        {isAdding && (
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Skill name"
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="number"
                value={newSkill.percentage}
                onChange={(e) => setNewSkill({ ...newSkill, percentage: parseInt(e.target.value) || 0 })}
                placeholder="%"
                className="w-20 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min="0"
                max="100"
              />
              <select
                value={newSkill.icon || ''}
                onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Icon</option>
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;