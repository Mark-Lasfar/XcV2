import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Edit2, Trash2, X } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface PostCardProps {
  post: any;
  isOwner: boolean;
  editMode: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isOwner,
  editMode,
  onLike,
  onComment,
  onShare,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.some((l: any) => l._id === 'currentUser'));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const isShared = post.sharedFrom?.originalPostId;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="post-card bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      {/* Header */}
      <div className="post-header px-4 py-3 flex items-center gap-3 border-b dark:border-gray-700">
        <img
          src={post.userId?.profile?.avatar || '/assets/img/default-avatar.png'}
          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
          onClick={() => window.location.href = `/profile/${post.userId?.profile?.nickname || post.userId?.username}`}
          alt="avatar"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="post-author font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500 transition"
              onClick={() => window.location.href = `/profile/${post.userId?.profile?.nickname || post.userId?.username}`}
            >
              {post.userId?.profile?.nickname || post.userId?.username}
            </span>
            {isShared && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Share2 className="w-3 h-3" /> shared
              </span>
            )}
          </div>
          <div className="post-time text-xs text-gray-400">
            {formatDate(post.createdAt)}
          </div>
        </div>
        {isOwner && editMode && (
          <div className="flex gap-1">
            <button className="p-1 text-blue-500 hover:text-blue-600">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1 text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!isShared && post.content && (
        <div className="post-content px-4 py-2 text-gray-700 dark:text-gray-300">
          {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
        </div>
      )}

      {/* Shared Card */}
      {isShared && (
        <div className="shared-card bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mx-3 mb-3 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.sharedFrom?.originalAuthorAvatar || '/assets/img/default-avatar.png'}
              className="w-5 h-5 rounded-full object-cover"
              alt="author"
            />
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Shared from</span>
              <a
                href={`/profile/${post.sharedFrom?.originalAuthorName}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {post.sharedFrom?.originalAuthorName}
              </a>
              <span className="text-gray-400">·</span>
              <span>{formatDate(post.sharedFrom?.sharedAt)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg p-2">
            <i className="bx bx-quote-left text-gray-400 text-xs mr-1"></i>
            {post.content?.replace(/^Shared a post by [^:]+:\s*/, '') || 'No content'}
          </div>
          <a
            href={`/post.html?id=${post.sharedFrom?.originalPostId}`}
            className="text-xs text-blue-500 hover:text-blue-600 mt-2 inline-flex items-center gap-1"
          >
            View original post <i className="bx bx-link-external"></i>
          </a>
        </div>
      )}

      {/* Images */}
      {post.images?.[0] && !isShared && (
        <div className="px-4 pb-2">
          <img
            src={post.images[0].url}
            className="rounded-lg max-h-96 w-full object-cover cursor-pointer hover:opacity-95 transition"
            onClick={() => window.open(post.images[0].url, '_blank')}
            alt="post"
          />
        </div>
      )}

      {/* Actions */}
      <div className="post-actions px-4 py-2 flex gap-6 border-t dark:border-gray-700 text-gray-500">
        <button
          onClick={handleLikeClick}
          className={`post-action flex items-center gap-1.5 cursor-pointer transition ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
          <span className="text-sm">{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="post-action flex items-center gap-1.5 cursor-pointer hover:text-blue-500 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{post.comments?.length || 0}</span>
        </button>
        <button
          onClick={() => onShare(post.id)}
          className="post-action flex items-center gap-1.5 cursor-pointer hover:text-green-500 transition"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm">{post.shares?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3 pt-1 border-t dark:border-gray-700">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {post.comments?.map((comment: any) => (
              <div key={comment._id} className="flex items-start gap-2 text-sm">
                <img
                  src={comment.userId?.profile?.avatar || '/assets/img/default-avatar.png'}
                  className="w-6 h-6 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <span className="font-semibold">
                    {comment.userId?.profile?.nickname || comment.userId?.username}
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {comment.text}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-1.5 border rounded-full text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};