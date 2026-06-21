import React, { createContext, useState, useCallback } from 'react';
import { ProfileData } from '../types/profile';
import { profileService } from '../services/profileService';

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  isOwner: boolean;
  fetchProfile: (nickname: string) => Promise<ProfileData | null>;
  updateProfile: (data: Partial<ProfileData>) => Promise<ProfileData | null>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = useCallback(async (nickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(nickname);
      setProfile(data);
      // Check if owner (needs current user logic)
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return null;
    }
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};