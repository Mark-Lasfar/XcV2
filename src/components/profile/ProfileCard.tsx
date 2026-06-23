import React, { useState, useRef, useEffect } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ✅ تحديث localProfile عند تغيير profile
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  // ✅ التحقق من وجود البيانات الأساسية
  const displayName = profile.nickname || profile.username || 'User';
  const displayAvatar = profile.avatar || '/assets/img/default-avatar.png';
  const displayCover = profile.coverImage || '/assets/img/default-cover.png';

  const handleAvatarUpload = async (file: File) => {
    try {
      const url = await uploadService.uploadAvatar(file);
      onUpdate({ avatar: url });
      setLocalProfile({ ...localProfile, avatar: url });
      setAvatarError(false);
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const url = await uploadService.uploadCover(file);
      onUpdate({ coverImage: url });
      setLocalProfile({ ...localProfile, coverImage: url });
      setCoverError(false);
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Failed to upload cover image. Please try again.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(localProfile);
      setIsEditing(false);
      // ✅ تحديث profile بالبيانات الجديدة
      setLocalProfile(localProfile);
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="card overflow-hidden">
      {/* Cover Image */}
      <ProfileCover
        image={displayCover}
        isOwner={isOwner}
        editMode={editMode}
        onUpload={handleCoverUpload}
        onRemove={() => onUpdate({ coverImage: '' })}
      />

      {/* Avatar */}
      <div className="relative px-4 pb-4 -mt-12">
        <div className="flex justify-center">
          <ProfileAvatar
            avatar={displayAvatar}
            name={displayName}
            isOwner={isOwner}
            editMode={editMode}
            onUpload={handleAvatarUpload}
          />
        </div>

        {/* Name & Title */}
        <div className="text-center mt-3">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block text-left font-medium">
                  Nickname
                </label>
                <input
                  type="text"
                  value={localProfile.nickname || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, nickname: e.target.value })}
                  className="w-full px-3 py-2 text-lg font-bold border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Your nickname"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block text-left font-medium">
                  Job Title
                </label>
                <input
                  type="text"
                  value={localProfile.jobTitle || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Your job title"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block text-left font-medium">
                  Bio
                </label>
                <textarea
                  value={localProfile.bio || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                  placeholder="Tell your story..."
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {localProfile.bio?.length || 0}/500
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-900 dark:text-white">
                {displayName}
                {profile.isVerified && (
                  <span className="text-blue-500" title="Verified Account">
                    <svg className="w-5 h-5 inline" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L15.09 4.26L19.8 5.4L21.45 9.84L20.1 14.4L16.2 17.4L12 19.9L7.8 17.4L3.9 14.4L2.55 9.84L4.2 5.4L8.91 4.26L12 1Z" />
                    </svg>
                  </span>
                )}
              </h1>
              {profile.jobTitle && (
                <p className="text-gray-600 dark:text-gray-400">{profile.jobTitle}</p>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              )}
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
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarUpload(file);
        }}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverUpload(file);
        }}
      />
    </div>
  );
};

export default ProfileCard;