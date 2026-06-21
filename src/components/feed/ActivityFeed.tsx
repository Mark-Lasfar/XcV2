import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { PostCard } from './PostCard';
import { useAuth } from '../../hooks/useAuth';
import { useEditMode } from '../../hooks/useEditMode';

interface ActivityFeedProps {
  userId: string;
  isOwner: boolean;
  editMode: boolean;
}

interface Post {
  id: string;
  content: string;
  images?: { url: string }[];
  likes: any[];
  comments: any[];
  shares: any[];
  userId: {
    _id: string;
    profile?: { nickname: string; avatar: string };
    username: string;
  };
  sharedFrom?: {
    originalPostId: string;
    originalAuthorId: string;
    originalAuthorName: string;
    sharedAt: string;
  };
  createdAt: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId, isOwner, editMode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const result = await profileService.getInteractions(userId, page);
      const newPosts = result.data || [];
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(result.pagination?.page < result.pagination?.pages);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Implement like functionality
  };

  const handleComment = async (postId: string, comment: string) => {
    // Implement comment functionality
  };

  const handleShare = async (postId: string) => {
    // Implement share functionality
  };

  if (loading && posts.length === 0) {
    return (
      <div className="card">
        <div className="card-header">Activity</div>
        <div className="card-content">
          <div className="flex items-center justify-center py-8">
            <div className="loader-spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card">
        <div className="card-header">Activity</div>
        <div className="card-content">
          <p className="text-gray-500 text-center py-4">
            {isOwner ? 'No posts yet. Share your first post!' : 'No activity yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <span>Activity</span>
        {isOwner && editMode && (
          <span className="text-xs text-gray-500">You can edit posts directly</span>
        )}
      </div>
      <div className="card-content">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isOwner={isOwner}
            editMode={editMode}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}
        {hasMore && (
          <button
            onClick={loadPosts}
            disabled={loading}
            className="w-full py-3 text-center text-blue-500 hover:text-blue-600 transition"
          >
            {loading ? 'Loading...' : 'Load more posts →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;