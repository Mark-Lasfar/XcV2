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

// ✅ دالة لتطبيع بيانات البروفايل بالكامل (تحويل كل الحقول من Object إلى Array)
const normalizeProfileData = (data: any): ProfileData => {
  // إذا كانت البيانات فارغة أو غير موجودة
  if (!data) return data;
  
  // إذا كان هناك حقل profile (هيكل قديم)، استخدمه
  const profileData = data.profile || data;
  
  return {
    ...data,
    // ✅ تحويل جميع الحقول من Object إلى Array
    skills: objectToArray(profileData.skills),
    experience: objectToArray(profileData.experience),
    education: objectToArray(profileData.education),
    certificates: objectToArray(profileData.certificates),
    projects: objectToArray(profileData.projects),
    interests: objectToArray(profileData.interests),
    // ✅ إذا كانت sections موجودة، طبعها
    sections: profileData.sections ? normalizeSections(profileData.sections) : [],
    // ✅ تأكد من وجود _id
    _id: profileData._id || data._id,
    id: profileData._id || data._id || profileData.id || data.id,
    // ✅ تأكد من وجود username و nickname
    username: data.username || profileData.username,
    nickname: profileData.nickname || data.nickname,
    // ✅ تأكد من وجود bio
    bio: profileData.bio || data.bio,
    // ✅ تأكد من وجود jobTitle
    jobTitle: profileData.jobTitle || data.jobTitle,
    // ✅ تأكد من وجود avatar
    avatar: profileData.avatar || data.avatar,
    // ✅ تأكد من وجود coverImage
    coverImage: profileData.coverImage || data.coverImage,
    // ✅ تأكد من وجود socialLinks
    socialLinks: profileData.socialLinks || data.socialLinks || {},
    // ✅ تأكد من وجود sectionVisibility
    sectionVisibility: profileData.sectionVisibility || data.sectionVisibility || {},
    // ✅ تأكد من وجود sectionNames
    sectionNames: profileData.sectionNames || data.sectionNames || {},
    // ✅ تأكد من وجود sectionStyleSettings
    sectionStyleSettings: profileData.sectionStyleSettings || data.sectionStyleSettings || {},
    // ✅ تأكد من وجود stats
    stats: profileData.stats || data.stats || { posts: 0, followers: 0, following: 0 },
    // ✅ تأكد من وجود isPublic
    isPublic: profileData.isPublic !== undefined ? profileData.isPublic : (data.isPublic !== undefined ? data.isPublic : true),
    // ✅ تأكد من وجود aiBot
    aiBot: profileData.aiBot || data.aiBot || { enabled: false, provider: 'XCV' },
    // ✅ تأكد من وجود createdAt و updatedAt
    createdAt: profileData.createdAt || data.createdAt || new Date().toISOString(),
    updatedAt: profileData.updatedAt || data.updatedAt || new Date().toISOString(),
  };
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
      const rawData = await profileService.getProfile(nickname);
      
      // ✅ تطبيع البيانات بالكامل (تحويل Objects إلى Arrays)
      const normalizedData = normalizeProfileData(rawData);
      
      // ✅ إذا كانت الأقسام موجودة، طبعها
      if (normalizedData.sections && normalizedData.sections.length > 0) {
        normalizedData.sections = normalizeSections(normalizedData.sections);
      } else {
        // ✅ إذا مفيش أقسام، استخدم الأقسام الافتراضية مع تحويل Objects إلى Arrays
        normalizedData.sections = getDefaultSections(normalizedData);
      }
      
      // ✅ تأكد من أن جميع الحقول التي تحتاجها الأقسام موجودة
      console.log('✅ Profile loaded:', normalizedData);
      console.log('📊 Skills:', normalizedData.skills);
      console.log('📊 Experience:', normalizedData.experience);
      console.log('📊 Education:', normalizedData.education);
      console.log('📊 Certificates:', normalizedData.certificates);
      console.log('📊 Projects:', normalizedData.projects);
      console.log('📊 Interests:', normalizedData.interests);
      console.log('📊 Sections:', normalizedData.sections);
      
      setProfile(normalizedData);
      
      const userNickname = user?.profile?.nickname || user?.username;
      setIsOwner(userNickname?.toLowerCase() === nickname?.toLowerCase());
      
      return normalizedData;
    } catch (err: any) {
      console.error('❌ Error fetching profile:', err);
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
      // ✅ تطبيع البيانات بعد التحديث
      const normalized = normalizeProfileData(updated);
      setProfile(normalized);
      return normalized;
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