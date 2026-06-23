import React, { useState } from 'react';
import { useEditMode } from '../../hooks/useEditMode';
import { Edit2, Check, X, Maximize2, Minimize2 } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onUpdate(localBio);
    setIsEditing(false);
  };

  const handleTitleSave = () => {
    if (onTitleChange) onTitleChange(localTitle);
  };

  // ✅ حساب عدد الكلمات
  const wordCount = bio ? bio.trim().split(/\s+/).length : 0;
  const charCount = bio ? bio.length : 0;
  const isLongContent = charCount > 300 || wordCount > 50;

  // ✅ عرض النص مع دعم الـ line breaks
  const displayBio = bio || (isOwner ? 'Click the edit icon to add your story...' : 'No about information provided.');

  // ✅ معالجة النص: تحويل الروابط إلى روابط قابلة للنقر
  const formatBio = (text: string) => {
    if (!text) return text;
    
    // تحويل الروابط إلى <a> tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // ✅ النص المعروض (مع أو بدون توسيع)
  const getDisplayText = () => {
    if (isExpanded || !isLongContent) {
      return formatBio(displayBio);
    }
    // عرض أول 200 حرف فقط
    const truncated = displayBio.substring(0, 200);
    return (
      <>
        {formatBio(truncated)}
        {displayBio.length > 200 && '...'}
      </>
    );
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
              placeholder="Section title"
            />
          </div>
        ) : (
          <span>{localTitle}</span>
        )}
        <div className="flex items-center gap-1">
          {isOwner && editMode && !isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setLocalBio(bio);
              }}
              className="text-gray-400 hover:text-blue-500 transition p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
              aria-label="Edit about section"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="card-content">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 font-sans text-sm"
              placeholder="Tell your story... (you can include links, they will be clickable)"
              autoFocus
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setLocalBio(bio);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {localBio.length}/2000 characters
              </span>
            </div>
          </div>
        ) : (
          <div>
            {displayBio ? (
              <>
                <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {getDisplayText()}
                </div>
                
                {/* ✅ زر التوسيع */}
                {isLongContent && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 transition"
                  >
                    {isExpanded ? (
                      <>
                        <Minimize2 className="w-3 h-3" />
                        Show less
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3 h-3" />
                        Show more
                      </>
                    )}
                  </button>
                )}

                {/* ✅ إحصائيات النص */}
                {bio && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 border-t dark:border-gray-700 pt-2">
                    <span>📝 {wordCount} words</span>
                    <span>📏 {charCount} characters</span>
                    {isOwner && (
                      <span className="text-blue-400">✏️ Click edit to update</span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm italic">
                {isOwner ? 'Click the edit icon ✏️ to add your story...' : 'No about information provided.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSection;