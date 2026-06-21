import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, UserCheck } from 'lucide-react';

interface Suggestion {
  _id: string;
  username: string;
  profile?: {
    nickname?: string;
    avatar?: string;
    jobTitle?: string;
  };
  stats?: {
    followers: number;
  };
}

const PeopleSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadSuggestions();
    }
  }, [isAuthenticated]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const result = await profileService.getSuggestions();
      setSuggestions(result.data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      // Implement follow logic
      await profileService.followUser(userId);
      // Update local state
      setSuggestions(prev => prev.filter(s => s._id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card">
        <div className="card-header">People You May Know</div>
        <div className="card-content">
          <p className="text-center text-gray-500 text-sm py-4">
            Sign in to see who you may know
          </p>
          <a
            href="/login.html"
            className="block text-center text-blue-500 hover:text-blue-600 text-sm"
          >
            Sign in →
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">People You May Know</div>
        <div className="card-content">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <span>People You May Know</span>
        <a href="/explore.html" className="text-blue-500 text-xs hover:text-blue-600">
          Show all
        </a>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {suggestions.slice(0, 4).map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition"
              onClick={() => window.location.href = `/profile/${user.profile?.nickname || user.username}`}
            >
              <img
                src={user.profile?.avatar || '/assets/img/default-avatar.png'}
                className="w-10 h-10 rounded-full object-cover"
                alt={user.profile?.nickname || user.username}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {user.profile?.nickname || user.username}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.profile?.jobTitle || 'Professional'}
                </div>
                <div className="text-xs text-gray-400">
                  {user.stats?.followers?.toLocaleString() || 0} followers
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user._id);
                }}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleSuggestions;