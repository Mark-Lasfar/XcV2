import React, { useRef, useState } from 'react';
import { Camera, Edit2, X } from 'lucide-react';

interface ProfileAvatarProps {
  avatar?: string;
  name: string;
  isOwner: boolean;
  editMode: boolean;
  onUpload: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, WEBP, or GIF)');
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
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          relative rounded-full overflow-hidden
          ${sizeClasses[size]}
          ${isOwner && editMode ? 'cursor-pointer ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/img/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(name)}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Hover Overlay for Edit */}
        {isOwner && editMode && !isLoading && isHovering && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Edit Button */}
      {isOwner && editMode && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
          title="Change avatar"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;