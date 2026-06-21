import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { profileService } from '../services/profileService';
import { ProfileData } from '../types/profile';
import { Section, SectionVisibility } from '../types/section';

export const useProfile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = useCallback(async (nickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(nickname);
      setProfile(data);
      
      // ✅ الوصول إلى nickname من user.profile
      const userNickname = user?.profile?.nickname || user?.username;
      setIsOwner(userNickname === nickname);
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    if (!profile || !isOwner) return;
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return null;
    }
  }, [profile, isOwner]);

  const updateSection = useCallback(async (sectionId: string, data: Partial<Section>) => {
    if (!profile || !isOwner) return;
    try {
      // ✅ التأكد من وجود sections
      const currentSections = profile.sections || [];
      const updatedSections = currentSections.map(s => 
        s.id === sectionId ? { ...s, ...data } : s
      );
      const updated = await profileService.updateSections(updatedSections);
      setProfile({ ...profile, sections: updated });
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update section');
      return null;
    }
  }, [profile, isOwner]);

  const addSection = useCallback(async (section: Section) => {
    if (!profile || !isOwner) return;
    try {
      const currentSections = profile.sections || [];
      const updatedSections = [...currentSections, section];
      const updated = await profileService.updateSections(updatedSections);
      setProfile({ ...profile, sections: updated });
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to add section');
      return null;
    }
  }, [profile, isOwner]);

  const deleteSection = useCallback(async (sectionId: string) => {
    if (!profile || !isOwner) return;
    try {
      const currentSections = profile.sections || [];
      const updatedSections = currentSections.filter(s => s.id !== sectionId);
      const updated = await profileService.updateSections(updatedSections);
      setProfile({ ...profile, sections: updated });
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to delete section');
      return null;
    }
  }, [profile, isOwner]);

  const updateSectionVisibility = useCallback(async (visibility: SectionVisibility) => {
    if (!profile || !isOwner) return;
    try {
      const updated = await profileService.updateVisibility(visibility);
      setProfile({ ...profile, sectionVisibility: visibility });
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update visibility');
      return null;
    }
  }, [profile, isOwner]);

  return {
    profile,
    loading,
    error,
    isOwner,
    fetchProfile,
    updateProfile,
    updateSection,
    addSection,
    deleteSection,
    updateSectionVisibility,
  };
};