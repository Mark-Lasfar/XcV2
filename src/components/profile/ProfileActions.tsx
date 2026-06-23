import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  UserPlus, 
  UserCheck, 
  MessageCircle, 
  Share2, 
  Copy, 
  Star, 
  Download, 
  Flag,
  Settings,
  Eye,
  EyeOff,
  MoreHorizontal,
  Edit2,
  Layout,
  Check,
  X
} from 'lucide-react';

interface ProfileActionsProps {
  profile: any;
  isOwner: boolean;
  editMode: boolean;
  isPreviewMode: boolean;
  onEdit: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onCopyLink?: () => void;
  onRate?: () => void;
  onDownloadCV?: () => void;
  onReport?: () => void;
  onTogglePreview?: () => void;
  onToggleEdit?: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  profile,
  isOwner,
  editMode,
  isPreviewMode,
  onEdit,
  onFollow,
  onMessage,
  onShare,
  onCopyLink,
  onRate,
  onDownloadCV,
  onReport,
  onTogglePreview,
  onToggleEdit,
}) => {
  const { isAuthenticated } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Reset follow state when profile changes
  useEffect(() => {
    // يمكنك إضافة منطق لجلب حالة المتابعة من الـ API هنا
    setIsFollowing(false);
  }, [profile?._id]);

  const handleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setIsFollowing(!isFollowing);
      if (onFollow) await onFollow();
    } catch (error) {
      console.error('Follow error:', error);
      setIsFollowing(!isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMore) {
        const target = e.target as HTMLElement;
        if (!target.closest('.more-dropdown')) {
          setShowMore(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMore]);

  // ✅ Owner Actions
  if (isOwner) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex-1 min-w-[120px] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
        <button
          onClick={onTogglePreview}
          className="flex-1 min-w-[120px] px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              Exit Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </button>
        <button
          onClick={onToggleEdit}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
            editMode
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Layout className="w-4 h-4" />
          {editMode ? (
            <>
              <Check className="w-4 h-4" />
              Done
            </>
          ) : (
            'Edit Layout'
          )}
        </button>
        <button
          onClick={() => window.location.href = '/settings'}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ✅ Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <a
          href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center"
        >
          Sign in to connect
        </a>
        <a
          href="/register"
          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center"
        >
          Join now
        </a>
      </div>
    );
  }

  // ✅ Visitor Actions
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
          isFollowing
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isFollowing ? (
          <>
            <UserCheck className="w-4 h-4" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Follow
          </>
        )}
      </button>

      <button
        onClick={onMessage}
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </button>

      <div className="relative more-dropdown">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
          aria-label="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMore && (
          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-10 animate-slide-down">
            <button
              onClick={() => { onShare?.(); setShowMore(false); }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3 text-sm"
            >
              <Share2 className="w-4 h-4 text-gray-500" />
              Share Profile
            </button>
            <button
              onClick={() => { onCopyLink?.(); setShowMore(false); }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3 text-sm"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              Copy Link
            </button>
            <button
              onClick={() => { onRate?.(); setShowMore(false); }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3 text-sm"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              Rate User
            </button>
            <button
              onClick={() => { onDownloadCV?.(); setShowMore(false); }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3 text-sm"
            >
              <Download className="w-4 h-4 text-blue-500" />
              Download CV
            </button>
            <hr className="dark:border-gray-700" />
            <button
              onClick={() => { onReport?.(); setShowMore(false); }}
              className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-3 text-sm"
            >
              <Flag className="w-4 h-4" />
              Report User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileActions;