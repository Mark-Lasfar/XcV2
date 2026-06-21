import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  Book,
  Award,
  Star,
  Code,
  Heart,
  Settings,
  Layout,
  Palette,
  Bot,
  Search,
  ChevronDown,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  Shield,
  FileText,
  Music,
  Bell,
  Eye,
  Download,
  Share2,
  Users,
  Calendar,
  Image,
  Link as LinkIcon,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

interface Section {
  id: string;
  icon: LucideIcon;
  label: string;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isOwner,
  activeSection,
  onNavigate,
}) => {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // ✅ أقسام البروفايل الأساسية
  const profileSections: Section[] = [
    { id: 'personal-info', icon: User, label: 'Personal Info', description: 'Name, bio, job title' },
    { id: 'avatar', icon: Image, label: 'Profile Image', description: 'Avatar & cover photo' },
    { id: 'social-links', icon: LinkIcon, label: 'Social Links', description: 'LinkedIn, GitHub, etc.' },
    { id: 'contact-info', icon: Phone, label: 'Contact Info', description: 'Email, phone, location' },
  ];

  // ✅ أقسام المحتوى
  const contentSections: Section[] = [
    { id: 'education', icon: Book, label: 'Education', description: 'Schools & degrees' },
    { id: 'experience', icon: Briefcase, label: 'Experience', description: 'Work history' },
    { id: 'certificates', icon: Award, label: 'Certificates', description: 'Licenses & certifications' },
    { id: 'skills', icon: Star, label: 'Skills', description: 'Technical & soft skills' },
    { id: 'projects', icon: Code, label: 'Projects', description: 'Portfolio projects' },
    { id: 'interests', icon: Heart, label: 'Interests', description: 'Hobbies & passions' },
  ];

  // ✅ الأقسام المتقدمة
  const advancedSections: Section[] = [
    { id: 'ai-bot', icon: Bot, label: 'AI Bot', description: 'AI assistant settings' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Colors & theme' },
    { id: 'design-settings', icon: Layout, label: 'Design Settings', description: 'Layout & style' },
    { id: 'section-visibility', icon: Eye, label: 'Section Visibility', description: 'Show/hide sections' },
    { id: 'custom-sections', icon: FileText, label: 'Custom Sections', description: 'Add custom sections' },
    { id: 'seo', icon: Globe, label: 'SEO Settings', description: 'Search engine optimization' },
    { id: 'schema', icon: Shield, label: 'Schema.org', description: 'Structured data' },
    { id: 'profile-audio', icon: Music, label: 'Profile Music', description: 'Background music' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Notification settings' },
    { id: 'interactions-privacy', icon: Eye, label: 'Privacy', description: 'Interaction privacy' },
    { id: 'pdf-format', icon: FileText, label: 'PDF Format', description: 'Resume export' },
    { id: 'resume', icon: Download, label: 'Resume (CV)', description: 'Upload & manage CV' },
  ];

  const handleNavigate = (section: string) => {
    if (onNavigate) onNavigate(section);
    onClose();
  };

  // ✅ دالة لعرض مجموعة الأقسام
  const renderSectionGroup = (sections: Section[], title?: string) => {
    if (title) {
      return (
        <div className="mb-3">
          {title && (
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {title}
            </div>
          )}
          <div className="space-y-0.5">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group
                  ${activeSection === section.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
                title={section.description}
              >
                <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{section.label}</span>
                {section.description && (
                  <span className="text-[10px] opacity-50 hidden group-hover:block">
                    {section.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // بدون عنوان
    return (
      <div className="space-y-0.5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavigate(section.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group
              ${activeSection === section.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }
            `}
          >
            <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`} />
            <span className="flex-1 text-left">{section.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:z-auto
          border-r dark:border-gray-700 overflow-y-auto
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b dark:border-gray-700">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Profile Settings</span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Profile Settings Group */}
          <div className="mb-3">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">Basic Information</span>
              </div>
              {profileOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {profileOpen && (
              <div className="ml-4 mt-1">
                {renderSectionGroup(profileSections)}
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div className="mb-3">
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Content
            </div>
            {renderSectionGroup(contentSections)}
          </div>

          {/* Advanced Settings */}
          {isOwner && (
            <div className="mb-3">
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Advanced Settings</span>
                </div>
                {advancedOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {advancedOpen && (
                <div className="ml-4 mt-1">
                  {renderSectionGroup(advancedSections)}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 pt-3 border-t dark:border-gray-700 space-y-1">
            <button
              onClick={() => window.open(`/profile/${location.pathname.split('/').pop()}`, '_blank')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
            >
              <Eye className="w-4 h-4" />
              <span>View Public Profile</span>
            </button>
            <button
              onClick={() => handleNavigate('share-profile')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </button>
          </div>

          {/* Delete Account */}
          {isOwner && (
            <div className="mt-4 pt-3 border-t dark:border-gray-700">
              <button
                onClick={() => handleNavigate('delete-account')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <User className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          )}

          {/* Version */}
          <div className="mt-4 text-center text-[10px] text-gray-400 dark:text-gray-500">
            Profile v2.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;