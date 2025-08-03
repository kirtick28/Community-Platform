import { useState } from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import CommentSection from './CommentSection.jsx';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { toggleLike } = useData();
  const [showComments, setShowComments] = useState(false);

  const isLiked = post?.likes?.includes(user?._id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleLike = () => {
    toggleLike(post._id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-gray-100 dark:border-gray-700 animate-slide-in-up">
      <div className="p-6 flex items-center space-x-4">
        <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-md">
          <span className="text-white font-bold text-xl">
            {post?.author?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
            {post?.author?.name || 'Unknown User'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            @{post?.author?.username || 'unknown'}
          </p>
        </div>
      </div>

      <div className="px-6 pb-4">
        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
          {post?.content}
        </p>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
              isLiked
                ? 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-semibold">{post?.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
              showComments
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">{post?.comments?.length || 0}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{formatDate(post?.createdAt)}</span>
        </div>
      </div>
      {showComments && (
        <CommentSection post={post} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
};

export default PostCard;
