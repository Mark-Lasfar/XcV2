import React, { createContext, useState, useCallback, useContext } from 'react';
import { ProfileData } from '../types/profile';
import { profileService } from '../services/profileService';
import { normalizeSections } from '../types/section';
import { useAuth } from '../hooks/useAuth';

// ✅ دالة مساعدة لتحويل Object إلى Array
const objectToArray = <T,>(obj: any): T[] => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (typeof obj === 'object') {
    return Object.values(obj);
  }
  return [];
};

// ✅ دالة لتطبيع بيانات البروفايل بالكامل
const normalizeProfileData = (data: any): ProfileData => {
  if (!data) return data;
  
  const profileData = data.profile || data;
  
  return {
    ...data,
    _id: profileData._id || data._id,
    id: profileData._id || data._id || profileData.id || data.id,
    username: data.username || profileData.username,
    nickname: profileData.nickname || data.nickname,
    bio: profileData.bio || data.bio,
    jobTitle: profileData.jobTitle || data.jobTitle,
    avatar: profileData.avatar || data.avatar,
    coverImage: profileData.coverImage || data.coverImage,
    socialLinks: profileData.socialLinks || data.socialLinks || {},
    sectionVisibility: profileData.sectionVisibility || data.sectionVisibility || {},
    sectionNames: profileData.sectionNames || data.sectionNames || {},
    sectionStyleSettings: profileData.sectionStyleSettings || data.sectionStyleSettings || {},
    stats: profileData.stats || data.stats || { posts: 0, followers: 0, following: 0 },
    isPublic: profileData.isPublic !== undefined ? profileData.isPublic : (data.isPublic !== undefined ? data.isPublic : true),
    aiBot: profileData.aiBot || data.aiBot || { enabled: false, provider: 'XCV' },
    createdAt: profileData.createdAt || data.createdAt || new Date().toISOString(),
    updatedAt: profileData.updatedAt || data.updatedAt || new Date().toISOString(),
    // ✅ تحويل جميع الحقول من Object إلى Array
    skills: objectToArray(profileData.skills),
    experience: objectToArray(profileData.experience),
    education: objectToArray(profileData.education),
    certificates: objectToArray(profileData.certificates),
    projects: objectToArray(profileData.projects),
    interests: objectToArray(profileData.interests),
    sections: profileData.sections ? normalizeSections(profileData.sections) : [],
  };
};

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  isOwner: boolean;
  fetchProfile: (nickname: string) => Promise<ProfileData | null>;
  updateProfile: (data: Partial<ProfileData>) => Promise<ProfileData | null>;
  resetProfile: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = useCallback(async (nickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await profileService.getProfile(nickname);
      
      // ✅ تطبيع البيانات بالكامل
      const normalizedData = normalizeProfileData(rawData);
      
      setProfile(normalizedData);
      
      // ✅ التحقق من أن المستخدم الحالي هو صاحب البروفايل
      const userNickname = user?.profile?.nickname || user?.username;
      setIsOwner(userNickname?.toLowerCase() === nickname?.toLowerCase());
      
      console.log('✅ Profile loaded in context:', normalizedData);
      return normalizedData;
    } catch (err: any) {
      console.error('❌ Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    try {
      const updated = await profileService.updateProfile(data);
      // ✅ تطبيع البيانات بعد التحديث
      const normalized = normalizeProfileData(updated);
      setProfile(normalized);
      return normalized;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return null;
    }
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(null);
    setLoading(false);
    setError(null);
    setIsOwner(false);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        isOwner,
        fetchProfile,
        updateProfile,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};