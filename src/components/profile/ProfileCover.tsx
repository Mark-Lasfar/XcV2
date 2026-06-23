import React, { useRef, useState } from 'react';
import { Camera, Edit2, Trash2, X } from 'lucide-react';

interface ProfileCoverProps {
  image?: string;
  isOwner: boolean;
  editMode: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({
  image,
  isOwner,
  editMode,
  onUpload,
  onRemove,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, WEBP, GIF, or SVG)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onUpload(file);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Failed to upload cover image. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    setShowRemoveConfirm(false);
    try {
      onRemove();
    } catch (error) {
      console.error('Cover remove error:', error);
      alert('Failed to remove cover image. Please try again.');
    }
  };

  return (
    <div
      className="relative w-full h-32 md:h-40 lg:h-48 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {image ? (
        <img
          src={image}
          alt="Profile cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/img/default-cover.png';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <span className="text-white/20 text-4xl font-bold">XCV</span>
        </div>
      )}

      {/* Upload Progress */}
      {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
          <div className="w-48 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-white text-sm">{uploadProgress}%</span>
        </div>
      )}

      {/* Edit Controls */}
      {isOwner && editMode && !isLoading && isHovering && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity animate-fade-in">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/95 text-gray-800 rounded-lg hover:bg-white transition flex items-center gap-2 text-sm font-medium shadow-lg"
          >
            <Camera className="w-4 h-4" />
            Change Cover
          </button>
          {image && (
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm font-medium shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          )}
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Remove Cover Image?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This will remove your cover image. You can upload a new one later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfileCover;