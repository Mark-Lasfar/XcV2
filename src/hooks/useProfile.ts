import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { profileService } from '../services/profileService';
import { ProfileData } from '../types/profile';
import { Section, SectionVisibility } from '../types/section';
import { normalizeSections } from '../types/section';

// ✅ دالة مساعدة لتحويل Object إلى Array
// مثال: { "0": { name: "React" }, "1": { name: "Node" } } => [{ name: "React" }, { name: "Node" }]
const objectToArray = <T>(obj: any): T[] => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (typeof obj === 'object') {
    return Object.values(obj);
  }
  return [];
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // ✅ دالة مساعدة لإنشاء الأقسام الافتراضية من بيانات البروفايل
  const getDefaultSections = useCallback((profileData: ProfileData): Section[] => {
    const sections: Section[] = [];

    // 1. About Section - دائماً موجود
    sections.push({
      id: 'about',
      type: 'about',
      name: 'About',
      column: 'main',
      order: 0,
      visible: true,
      content: { text: profileData.bio || 'No about information provided.' }
    });

    // 2. Skills Section - تحويل من Object إلى Array
    const skills = objectToArray(profileData.skills);
    if (skills.length > 0) {
      sections.push({
        id: 'skills',
        type: 'skills',
        name: 'Skills & Expertise',
        column: 'left',
        order: 0,
        visible: true,
        content: { items: skills }
      });
    }

    // 3. Experience Section - تحويل من Object إلى Array
    const experience = objectToArray(profileData.experience);
    if (experience.length > 0) {
      sections.push({
        id: 'experience',
        type: 'experience',
        name: 'Experience',
        column: 'main',
        order: 1,
        visible: true,
        content: { items: experience }
      });
    }

    // 4. Education Section - تحويل من Object إلى Array
    const education = objectToArray(profileData.education);
    if (education.length > 0) {
      sections.push({
        id: 'education',
        type: 'education',
        name: 'Education',
        column: 'main',
        order: 2,
        visible: true,
        content: { items: education }
      });
    }

    // 5. Certificates Section - تحويل من Object إلى Array
    const certificates = objectToArray(profileData.certificates);
    if (certificates.length > 0) {
      sections.push({
        id: 'certificates',
        type: 'certificates',
        name: 'Licenses & Certificates',
        column: 'right',
        order: 0,
        visible: true,
        content: { items: certificates }
      });
    }

    // 6. Projects Section - تحويل من Object إلى Array
    const projects = objectToArray(profileData.projects);
    if (projects.length > 0) {
      sections.push({
        id: 'projects',
        type: 'projects',
        name: 'Projects',
        column: 'main',
        order: 3,
        visible: true,
        content: { items: projects }
      });
    }

    // 7. Interests Section - تحويل من Object إلى Array
    const interests = objectToArray(profileData.interests);
    if (interests.length > 0) {
      sections.push({
        id: 'interests',
        type: 'interests',
        name: 'Interests',
        column: 'right',
        order: 1,
        visible: true,
        content: { items: interests }
      });
    }

    // 8. Contact Info Section
    if (profileData.phone || profileData.email) {
      const contactInfo: string[] = [];
      if (profileData.phone) contactInfo.push(`📱 ${profileData.phone}`);
      if (profileData.email) contactInfo.push(`✉️ ${profileData.email}`);
      if (profileData.location) contactInfo.push(`📍 ${profileData.location}`);
      
      if (contactInfo.length > 0) {
        sections.push({
          id: 'contact-info',
          type: 'custom',
          name: 'Contact Info',
          column: 'left',
          order: 1,
          visible: true,
          content: { 
            type: 'contact',
            items: contactInfo 
          }
        });
      }
    }

    // 9. Social Links Section
    if (profileData.socialLinks) {
      const socialLinks = Object.entries(profileData.socialLinks)
        .filter(([_, value]) => value && value.trim() !== '');
      
      if (socialLinks.length > 0) {
        sections.push({
          id: 'social-links',
          type: 'custom',
          name: 'Social Links',
          column: 'left',
          order: 2,
          visible: true,
          content: { 
            type: 'social',
            items: socialLinks.map(([platform, url]) => ({ platform, url }))
          }
        });
      }
    }

    return sections;
  }, []);

  const fetchProfile = useCallback(async (nickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile(nickname);
      
      // ✅ إذا كانت الأقسام موجودة، طبعها
      if (data.sections && data.sections.length > 0) {
        data.sections = normalizeSections(data.sections);
      } else {
        // ✅ إذا مفيش أقسام، استخدم الأقسام الافتراضية مع تحويل Objects إلى Arrays
        data.sections = getDefaultSections(data);
      }
      
      setProfile(data);
      
      const userNickname = user?.profile?.nickname || user?.username;
      setIsOwner(userNickname?.toLowerCase() === nickname?.toLowerCase());
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, getDefaultSections]);

  const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
    if (!profile || !isOwner) return null;
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
    if (!profile || !isOwner) return null;
    try {
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
    if (!profile || !isOwner) return null;
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
    if (!profile || !isOwner) return null;
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
    if (!profile || !isOwner) return null;
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