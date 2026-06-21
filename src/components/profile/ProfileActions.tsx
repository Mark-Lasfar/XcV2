import React, { useState } from 'react';
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
  Layout
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) onFollow();
  };

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
              Preview as Visitor
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
          {editMode ? 'Done Editing' : 'Edit Layout'}
        </button>
        <button
          onClick={() => window.location.href = '/settings.html'}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <a
          href={`/login.html?redirect=${encodeURIComponent(window.location.pathname)}`}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center"
        >
          Sign in to connect
        </a>
        <a
          href="/register.html"
          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-center"
        >
          Join now
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={handleFollow}
        className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
          isFollowing
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isFollowing ? (
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

      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMore && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-10">
            <button
              onClick={() => { onShare?.(); setShowMore(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Profile
            </button>
            <button
              onClick={() => { onCopyLink?.(); setShowMore(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
            <button
              onClick={() => { onRate?.(); setShowMore(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm"
            >
              <Star className="w-4 h-4" />
              Rate User
            </button>
            <button
              onClick={() => { onDownloadCV?.(); setShowMore(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download CV
            </button>
            <hr className="dark:border-gray-700" />
            <button
              onClick={() => { onReport?.(); setShowMore(false); }}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2 text-sm"
            >
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileActions;