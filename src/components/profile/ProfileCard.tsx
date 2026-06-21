import React, { useState, useRef } from 'react';
import { ProfileData } from '../../types/profile';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import { useAuth } from '../../hooks/useAuth';
import { uploadService } from '../../services/uploadService';
import ProfileCover from './ProfileCover';
import ProfileAvatar from './ProfileAvatar';
import SocialLinks from './SocialLinks';

interface ProfileCardProps {
  profile: ProfileData;
  isOwner: boolean;
  editMode: boolean;
  isPreviewMode: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isOwner,
  editMode,
  isPreviewMode,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    try {
      const url = await uploadService.uploadAvatar(file);
      onUpdate({ avatar: url });
      setLocalProfile({ ...localProfile, avatar: url });
    } catch (error) {
      console.error('Avatar upload error:', error);
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const url = await uploadService.uploadCover(file);
      onUpdate({ coverImage: url });
      setLocalProfile({ ...localProfile, coverImage: url });
    } catch (error) {
      console.error('Cover upload error:', error);
    }
  };

  const handleSave = () => {
    onUpdate(localProfile);
    setIsEditing(false);
  };

  return (
    <div className="card overflow-hidden">
      {/* Cover Image */}
      <ProfileCover
        image={profile.coverImage} 
        isOwner={isOwner}
        editMode={editMode}
        onUpload={handleCoverUpload}
        onRemove={() => onUpdate({ coverImage: '' })}
      />

      {/* Avatar */}
      <div className="relative px-4 pb-4 -mt-12">
        <div className="flex justify-center">
          <ProfileAvatar
            avatar={profile.avatar}
            name={profile.nickname || profile.username}
            isOwner={isOwner}
            editMode={editMode}
            onUpload={handleAvatarUpload}
          />
        </div>

        {/* Name & Title */}
        <div className="text-center mt-3">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={localProfile.nickname || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, nickname: e.target.value })}
                className="w-full px-3 py-2 text-lg font-bold border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Nickname"
              />
              <input
                type="text"
                value={localProfile.jobTitle || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, jobTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Job Title"
              />
              <textarea
                value={localProfile.bio || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                placeholder="Bio"
              />
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold flex items-center justify-center gap-2">
                {profile.nickname || profile.username}
                {profile.isVerified && (
                  <span className="text-blue-500" title="Verified">
                    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L15.09 4.26L19.8 5.4L21.45 9.84L20.1 14.4L16.2 17.4L12 19.9L7.8 17.4L3.9 14.4L2.55 9.84L4.2 5.4L8.91 4.26L12 1Z" />
                    </svg>
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{profile.jobTitle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{profile.bio}</p>
            </>
          )}
        </div>

        {/* Actions */}
        <ProfileActions 
          profile={profile}
          isOwner={isOwner}
          editMode={editMode}
          isPreviewMode={isPreviewMode}
          onEdit={() => setIsEditing(true)}
        />

        {/* Stats */}
        <ProfileStats 
          postsCount={profile.stats?.posts || 0}
          followersCount={profile.stats?.followers || 0}
          followingCount={profile.stats?.following || 0}
        />

        {/* Social Links */}
        <SocialLinks
          links={profile.socialLinks || {}}
          isOwner={isOwner}
          editMode={editMode}
          onUpdate={(links) => onUpdate({ socialLinks: links })}
        />
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarUpload(file);
        }}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverUpload(file);
        }}
      />
    </div>
  );
};

export default ProfileCard;