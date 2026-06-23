import React, { useState } from 'react';
import { Plus, X, Heart } from 'lucide-react';

interface InterestsSectionProps {
  interests: string[] | any; // ✅ قبول Array أو Object
  isOwner: boolean;
  editMode: boolean;
  onUpdate: (interests: string[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

// ✅ دالة مساعدة لتحويل Object إلى Array
const toArray = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') {
    return Object.values(data);
  }
  return [];
};

const InterestsSection: React.FC<InterestsSectionProps> = ({
  interests: interestsProp,
  isOwner,
  editMode,
  onUpdate,
  title = 'Interests',
  onTitleChange,
}) => {
  // ✅ تحويل البيانات إلى Array
  const interests = toArray(interestsProp);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [localTitle, setLocalTitle] = useState(title);

  const handleAdd = () => {
    if (newInterest.trim()) {
      onUpdate([...interests, newInterest.trim()]);
      setNewInterest('');
      setIsAdding(false);
    }
  };

  const handleDelete = (index: number) => {
    onUpdate(interests.filter((_, i) => i !== index));
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  // Color palette for interest badges
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  ];

  const hasInterests = interests.length > 0;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        {editMode ? (
          <div className="flex items-center gap-2 flex-1">
            <Heart className="w-5 h-5 text-red-500" />
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
            <Heart className="w-5 h-5 text-red-500" />
            {localTitle}
          </span>
        )}
        {isOwner && editMode && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-500 hover:text-blue-600 transition"
            aria-label="Add interest"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card-content">
        {!hasInterests ? (
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Click + to add your interests' : 'No interests added'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <div
                key={index}
                className={`group relative px-3 py-1.5 rounded-full text-sm ${colors[index % colors.length]}`}
              >
                {interest}
                {isOwner && editMode && (
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    aria-label="Delete interest"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <button
              onClick={handleAdd}
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
        )}
      </div>
    </div>
  );
};

export default InterestsSection;