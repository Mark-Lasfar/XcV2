import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, UserCheck, Store } from 'lucide-react';

interface PageSuggestion {
  _id: string;
  name: string;
  logo?: string;
  followersCount: number;
  isFollowing: boolean;
  nickname?: string;
}

const PagesSuggestions: React.FC = () => {
  const [pages, setPages] = useState<PageSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadPages();
    }
  }, [isAuthenticated]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const result = await profileService.getPageSuggestions();
      setPages(result.data || []);
    } catch (error) {
      console.error('Error loading page suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (pageId: string) => {
    try {
      await profileService.followPage(pageId);
      setPages(prev => prev.map(p =>
        p._id === pageId ? { ...p, isFollowing: !p.isFollowing } : p
      ));
    } catch (error) {
      console.error('Error following page:', error);
    }
  };

  if (!isAuthenticated || pages.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <span>You Might Like</span>
        <a href="/explore.html?tab=pages" className="text-blue-500 text-xs hover:text-blue-600">
          Show all
        </a>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {pages.slice(0, 3).map((page) => (
            <div
              key={page._id}
              className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition"
              onClick={() => window.location.href = `/page/${page.nickname}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                {page.logo ? (
                  <img
                    src={page.logo}
                    className="w-full h-full rounded-full object-cover"
                    alt={page.name}
                  />
                ) : (
                  <Store className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {page.name}
                </div>
                <div className="text-xs text-gray-500">
                  {page.followersCount?.toLocaleString() || 0} followers
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(page._id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 ${
                  page.isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {page.isFollowing ? (
                  <>
                    <UserCheck className="w-3 h-3" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    Follow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesSuggestions;