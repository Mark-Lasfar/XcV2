import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { PostCard } from './PostCard';
import { useAuth } from '../../hooks/useAuth';
import { useEditMode } from '../../hooks/useEditMode';

// ✅ استخدم userId (ObjectId) وليس nickname
interface ActivityFeedProps {
  userId: string;  // ✅ ObjectId من البروفايل
  isOwner: boolean;
  editMode: boolean;
}

interface Post {
  id: string;
  _id?: string;
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
  timestamp?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId, isOwner, editMode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const result = await profileService.getInteractions(userId, page);
      
      let newPosts: Post[] = [];
      
      if (Array.isArray(result)) {
        newPosts = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        newPosts = result.data;
      } else if (result && result.posts && Array.isArray(result.posts)) {
        newPosts = result.posts;
      } else if (result && Array.isArray(result.items)) {
        newPosts = result.items;
      }
      
      newPosts = newPosts.map(post => ({
        ...post,
        id: post.id || post._id || `post-${Date.now()}`,
        createdAt: post.createdAt || post.timestamp || new Date().toISOString()
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      
      if (result && result.pagination) {
        setHasMore(result.pagination.page < result.pagination.pages);
      } else if (newPosts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading posts:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleComment = async (postId: string, comment: string) => {
    console.log('Comment on post:', postId, comment);
  };

  const handleShare = async (postId: string) => {
    console.log('Share post:', postId);
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
        <div className="space-y-4">
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
        </div>
        {hasMore && (
          <button
            onClick={loadPosts}
            disabled={loading}
            className="w-full mt-4 py-3 text-center text-blue-500 hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader-spinner w-4 h-4" />
                Loading...
              </span>
            ) : (
              'Load more posts →'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;