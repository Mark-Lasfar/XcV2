import React, { useRef, useState } from 'react';
import { Camera, Edit2, X } from 'lucide-react';

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  isOwner: boolean;
  editMode: boolean;
  onUpload: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatar,
  name,
  isOwner,
  editMode,
  onUpload,
  size = 'lg',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-3xl',
    '2xl': 'w-40 h-40 text-4xl',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, WEBP, GIF, or SVG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      await onUpload(file);
      setImageError(false);
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-emerald-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          relative rounded-full overflow-hidden shadow-lg
          ${sizeClasses[size]}
          ${isOwner && editMode ? 'cursor-pointer ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
          transition-all duration-200
          ${isHovering && isOwner && editMode ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {avatar && !imageError ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getColorFromName(name)} flex items-center justify-center text-white font-bold`}>
            {getInitials(name)}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Hover Overlay for Edit */}
        {isOwner && editMode && !isLoading && isHovering && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Edit Button */}
      {isOwner && editMode && !isLoading && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200"
          title="Change avatar"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
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

export default ProfileAvatar;