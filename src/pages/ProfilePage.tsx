import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { normalizeSections } from '../types/section';
import { useEditMode } from '../hooks/useEditMode';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { useSocket } from '../hooks/useSocket';
import { Helmet } from 'react-helmet-async';
import { showToast } from '../components/common/Toast';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Layout Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Profile Components
import ProfileCard from '../components/profile/ProfileCard';

// Section Components
import AboutSection from '../components/sections/AboutSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import EducationSection from '../components/sections/EducationSection';
import CertificatesSection from '../components/sections/CertificatesSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import InterestsSection from '../components/sections/InterestsSection';
import CustomSection from '../components/sections/CustomSection';
import ContributionGraph from '../components/sections/ContributionGraph';

// Feed Components
import ActivityFeed from '../components/feed/ActivityFeed';

// Suggestions
import PeopleSuggestions from '../components/suggestions/PeopleSuggestions';
import PagesSuggestions from '../components/suggestions/PagesSuggestions';

// AI Components
import AIBot from '../components/ai/AIBot';

// Edit Components
import EditControls from '../components/edit/EditControls';
import SectionEditor from '../components/edit/SectionEditor';
import { DragDropContext, Droppable, Draggable } from '../components/edit/DragDropContext';

// Common Components
import { Skeleton, ProfileSkeleton, SectionSkeleton } from '../components/common/Skeleton';

// Types
import { Section } from '../types/section';
import { ProfileData } from '../types/profile';

const ProfilePage: React.FC = () => {
  const { nickname } = useParams<{ nickname: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, token, loading: authLoading } = useAuth();
  const { 
    profile, 
    loading, 
    error, 
    isOwner, 
    fetchProfile, 
    updateProfile,
    // ✅ نستخدم updateSection و addSection و deleteSection فقط للحفظ في الخادم
    updateSection: updateProfileSection,
    addSection: addProfileSection,
    deleteSection: deleteProfileSection,
    updateSectionVisibility,
  } = useProfile();
  const { 
    editMode, 
    toggleEditMode, 
    sections, 
    setSections,
    canUndo,
    canRedo,
    undo,
    redo,
    saveLayout,
    resetLayout,
    // ✅ دوال جديدة من useEditMode
    addSection: addSectionToLayout,
    removeSection: removeSectionFromLayout,
    updateSection: updateSectionInLayout,
    moveSection,
  } = useEditMode();
  const { theme } = useTheme();
  const { unreadCount, loadNotifications } = useNotifications();
  const { socket, isConnected } = useSocket();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'about'>('profile');
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Load profile data with better error handling
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setIsProfileLoaded(false);
      
      try {
        let targetNickname = nickname;
        
        // Handle 'me' or empty nickname
        if (!targetNickname || targetNickname === 'me') {
          if (isAuthenticated && user) {
            targetNickname = user.profile?.nickname || user.username;
            if (!targetNickname) {
              showToast('Please complete your profile setup', 'warning');
              navigate('/settings');
              return;
            }
          } else {
            navigate('/login', { state: { from: location.pathname } });
            return;
          }
        }
        
        if (targetNickname) {
          const result = await fetchProfile(targetNickname);
          if (result) {
            setIsProfileLoaded(true);
            // ✅ تحديث الأقسام من البروفايل إلى useEditMode
            if (result.sections && result.sections.length > 0) {
              const normalizedSections = normalizeSections(result.sections);
              setSections(normalizedSections);

            }
            // Update URL if needed
            if (nickname !== targetNickname && nickname !== 'me') {
              navigate(`/profile/${targetNickname}`, { replace: true });
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
        showToast(err.message || 'Failed to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      loadProfile();
    }
  }, [nickname, isAuthenticated, user, authLoading, fetchProfile, navigate, location, setSections]);

  // Socket connection for real-time updates
  useEffect(() => {
    if (socket && isConnected && profile) {
      // Join profile room for real-time updates
      socket.emit('join-profile', { profileId: profile.id || profile._id });
      
      // Listen for profile updates
      socket.on('profile-updated', (updatedData) => {
        if (updatedData.id === profile.id || updatedData._id === profile._id) {
          showToast('Profile updated in real-time', 'info');
          fetchProfile(profile.nickname || profile.username);
        }
      });
      
      // Listen for new interactions
      socket.on('new-interaction', (data) => {
        if (data.targetUserId === profile.id || data.targetUserId === profile._id) {
          loadNotifications();
        }
      });
      
      return () => {
        socket.off('profile-updated');
        socket.off('new-interaction');
        socket.emit('leave-profile', { profileId: profile.id || profile._id });
      };
    }
  }, [socket, isConnected, profile, fetchProfile, loadNotifications]);

  // Auto-enter edit mode for owner (only on desktop)
  useEffect(() => {
    if (isOwner && !editMode && !isPreviewMode && !isMobile && isProfileLoaded) {
      // Optional: auto-enter edit mode
      // toggleEditMode();
    }
  }, [isOwner, isMobile, isProfileLoaded, editMode, isPreviewMode]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+E or Cmd+E to toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && isOwner) {
        e.preventDefault();
        toggleEditMode();
      }
      // Esc to exit edit mode
      if (e.key === 'Escape' && editMode) {
        toggleEditMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwner, editMode, toggleEditMode]);

  if (authLoading || loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          loading 
          isOwner={false} 
          editMode={false}
        />
        <main className="max-w-7xl mx-auto px-4 py-6 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <ProfileSkeleton />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <SectionSkeleton />
              <SectionSkeleton />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Profile Not Found
          </h2>
          <p className="text-gray-500 mt-2">{error || 'The profile you are looking for does not exist.'}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go Home
            </button>
            {isAuthenticated && (
              <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Go to Settings
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter sections by column
  const mainSections = sections.filter(s => s.column === 'main' && s.visible !== false);
  const leftSections = sections.filter(s => s.column === 'left' && s.visible !== false);
  const rightSections = sections.filter(s => s.column === 'right' && s.visible !== false);

  // Section map for rendering
  const sectionMap: Record<string, React.ComponentType<any>> = {
    about: AboutSection,
    experience: ExperienceSection,
    education: EducationSection,
    certificates: CertificatesSection,
    skills: SkillsSection,
    projects: ProjectsSection,
    interests: InterestsSection,
    custom: CustomSection,
  };

  // ✅ تحديث دالة renderSection لاستخدام دوال useEditMode
  const renderSection = useCallback((section: Section) => {
    const SectionComponent = sectionMap[section.type] || CustomSection;

    // ✅ دالة معالجة التحديث
    const handleUpdate = (data: any) => {
      // تحديث في الـ layout أولاً
      updateSectionInLayout(section.id, data);
      // ثم تحديث في الـ profile للخادم
      updateProfileSection(section.id, data);
    };

    // ✅ دالة معالجة الحذف
    const handleDelete = () => {
      if (confirm('Are you sure you want to delete this section?')) {
        // حذف من الـ layout أولاً
        removeSectionFromLayout(section.id);
        // ثم حذف من الـ profile
        deleteProfileSection(section.id);
        showToast('Section deleted successfully!', 'success');
      }
    };

    if (section.type === 'custom') {
      return (
        <CustomSection
          key={section.id}
          section={section}
          isOwner={isOwner}
          editMode={editMode}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      );
    }

    const commonProps = {
      isOwner,
      editMode,
      onTitleChange: (title: string) => handleUpdate({ name: title }),
    };

    switch (section.type) {
      case 'about':
        return (
          <AboutSection
            key={section.id}
            bio={section.content?.text || profile.bio || ''}
            onUpdate={(bio) => handleUpdate({ content: { text: bio } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            key={section.id}
            experiences={section.content?.items || profile.experience || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'education':
        return (
          <EducationSection
            key={section.id}
            educations={section.content?.items || profile.education || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'certificates':
        return (
          <CertificatesSection
            key={section.id}
            certificates={section.content?.items || profile.certificates || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key={section.id}
            skills={section.content?.items || profile.skills || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            key={section.id}
            projects={section.content?.items || profile.projects || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      case 'interests':
        return (
          <InterestsSection
            key={section.id}
            interests={section.content?.items || profile.interests || []}
            onUpdate={(items) => handleUpdate({ content: { items } })}
            title={section.name}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  }, [
    isOwner, 
    editMode, 
    profile, 
    updateSectionInLayout, 
    updateProfileSection, 
    removeSectionFromLayout, 
    deleteProfileSection
  ]);

  // Mobile tabs
  const renderMobileTabs = () => {
    if (!isMobile) return null;
    
    return (
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {['profile', 'activity', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'profile' && 'Profile'}
            {tab === 'activity' && 'Activity'}
            {tab === 'about' && 'About'}
          </button>
        ))}
      </div>
    );
  };

  // ✅ دالة معالجة إضافة قسم جديد
  const handleAddSection = (data: any) => {
    const newSection: Section = {
      ...data,
      id: `section-${Date.now()}`,
      order: sections.length,
    };
    // إضافة إلى الـ layout
    addSectionToLayout(newSection);
    // إضافة إلى الـ profile للخادم
    addProfileSection(newSection);
    setSelectedSection(null);
    showToast('Section added successfully!', 'success');
  };

  // ✅ دالة معالجة تحديث قسم
  const handleUpdateSection = (sectionId: string, data: any) => {
    // تحديث في الـ layout
    updateSectionInLayout(sectionId, data);
    // تحديث في الـ profile للخادم
    updateProfileSection(sectionId, data);
    setSelectedSection(null);
    showToast('Section updated successfully!', 'success');
  };

  return (
    <>
      <Helmet>
        <title>{profile.nickname || profile.username} | Professional Profile</title>
        <meta name="description" content={profile.bio || `View ${profile.nickname || profile.username}'s professional profile`} />
        <meta property="og:title" content={`${profile.nickname || profile.username} - Professional Profile`} />
        <meta property="og:description" content={profile.bio || `View ${profile.nickname || profile.username}'s professional profile`} />
        <meta property="og:image" content={profile.avatar || '/assets/img/default-avatar.png'} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${window.location.origin}/profile/${profile.nickname || profile.username}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": profile.nickname || profile.username,
            "description": profile.bio || '',
            "image": profile.avatar || '',
            "jobTitle": profile.jobTitle || '',
            "worksFor": profile.industry ? {
              "@type": "Organization",
              "name": profile.industry
            } : undefined,
            "sameAs": Object.values(profile.socialLinks || {}).filter(Boolean)
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header 
          profile={profile}
          isOwner={isOwner} 
          editMode={editMode}
          isPreviewMode={isPreviewMode}
          onToggleEdit={toggleEditMode}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          unreadCount={unreadCount}
        />

        <main className="max-w-7xl mx-auto px-4 py-6 pt-20" ref={mainContentRef}>
          {/* Edit Mode Banner */}
          {isOwner && editMode && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between flex-wrap gap-2 animate-slide-down">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  ✏️ Edit Mode Active
                </span>
                <span className="text-sm text-gray-500">
                  Drag sections to reorder • Click any element to edit
                </span>
                {isConnected && (
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Undo (Ctrl+Z)"
                >
                  ↺ Undo
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Redo (Ctrl+Y)"
                >
                  ↻ Redo
                </button>
                <button
                  onClick={() => setSelectedSection('new')}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  + Add Section
                </button>
                <button
                  onClick={toggleEditMode}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕ Exit
                </button>
              </div>
            </div>
          )}

          {/* Mobile Tabs */}
          {renderMobileTabs()}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            {(activeTab === 'profile' || !isMobile) && (
              <div className="lg:col-span-3 space-y-4">
                <ProfileCard 
                  profile={profile}
                  isOwner={isOwner}
                  editMode={editMode}
                  isPreviewMode={isPreviewMode}
                  onUpdate={updateProfile}
                />

                <DragDropContext 
                  sections={leftSections} 
                  column="left"
                  onReorder={(newSections: Section[]) => setSections(newSections)}
                  editMode={editMode}
                >
                  {leftSections.map((section, index) => (
                    <Draggable 
                      key={section.id} 
                      id={section.id} 
                      index={index}
                      disabled={!editMode}
                    >
                      {renderSection(section)}
                    </Draggable>
                  ))}
                </DragDropContext>
              </div>
            )}

            {/* Main Content */}
            {(activeTab === 'profile' || activeTab === 'activity' || activeTab === 'about' || !isMobile) && (
              <div className="lg:col-span-6 space-y-4">
                <DragDropContext 
                  sections={mainSections} 
                  column="main"
                  onReorder={(newSections: Section[]) => setSections(newSections)}
                  editMode={editMode}
                >
                  {mainSections.map((section, index) => (
                    <Draggable 
                      key={section.id} 
                      id={section.id} 
                      index={index}
                      disabled={!editMode}
                    >
                      {renderSection(section)}
                    </Draggable>
                  ))}
                </DragDropContext>

                {(activeTab === 'activity' || !isMobile) && (
                  <ActivityFeed 
                    userId={profile.id || profile._id}
                    isOwner={isOwner}
                    editMode={editMode}
                  />
                )}

                {(activeTab === 'about' || !isMobile) && (
                  <ContributionGraph 
                    userId={profile.id || profile._id}
                    isOwner={isOwner}
                  />
                )}
              </div>
            )}

            {/* Right Sidebar */}
            {(activeTab === 'profile' || !isMobile) && (
              <div className="lg:col-span-3 space-y-4">
                <DragDropContext 
                  sections={rightSections} 
                  column="right"
                  onReorder={(newSections: Section[]) => setSections(newSections)}
                  editMode={editMode}
                >
                  {rightSections.map((section, index) => (
                    <Draggable 
                      key={section.id} 
                      id={section.id} 
                      index={index}
                      disabled={!editMode}
                    >
                      {renderSection(section)}
                    </Draggable>
                  ))}
                </DragDropContext>

                {!isMobile && (
                  <>
                    <PeopleSuggestions />
                    <PagesSuggestions />
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer profile={profile} />

        {/* AI Bot */}
        <AIBot 
          nickname={profile.nickname || profile.username}
          isEnabled={profile.aiBot?.enabled || false}
          avatar={profile.avatar}
        />

        {/* Edit Controls */}
        {isOwner && editMode && (
          <EditControls 
            onAddSection={() => setSelectedSection('new')}
            onResetLayout={resetLayout}
            onSaveLayout={saveLayout}
            onExport={() => {
              const data = JSON.stringify(profile, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${profile.nickname || profile.username}-profile.json`;
              a.click();
              URL.revokeObjectURL(url);
              showToast('Profile exported successfully!', 'success');
            }}
          />
        )}

        {/* ✅ Section Editor Modal - محدث */}
        {selectedSection && (
          <SectionEditor
            section={selectedSection === 'new' ? null : sections.find(s => s.id === selectedSection) || null}
            isNew={selectedSection === 'new'}
            onClose={() => setSelectedSection(null)}
            onSave={(data) => {
              if (selectedSection === 'new') {
                handleAddSection(data);
              } else {
                handleUpdateSection(selectedSection, data);
              }
            }}
            onDelete={() => {
              if (selectedSection !== 'new') {
                const section = sections.find(s => s.id === selectedSection);
                if (section && confirm(`Delete "${section.name}" section?`)) {
                  removeSectionFromLayout(selectedSection);
                  deleteProfileSection(selectedSection);
                  setSelectedSection(null);
                  showToast('Section deleted successfully!', 'success');
                }
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;