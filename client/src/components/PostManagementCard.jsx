// client/src/components/PostManagementCard.jsx
import { useState } from 'react';
import { Heart, MessageCircle, Clock, Trash2, Edit3 } from 'lucide-react'; // Import Edit3
import CommentSection from './CommentSection.jsx';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PostManagementCard = ({ post, onEdit }) => {
  const { user } = useAuth();
  const { toggleLike, deletePost } = useData();
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {post?.author?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post?.author?.name || 'Unknown'}
              </h3>
              <p className="text-gray-500 text-sm">
                @{post?.author?.username || 'unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatDate(post?.createdAt)}</span>
            <button
              onClick={() => onEdit(post)}
              className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <p className="text-gray-800 leading-relaxed text-lg">{post?.content}</p>
      </div>

      {/* Post Actions */}
      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post?.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post?.comments?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection post={post} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
};

export default PostManagementCard;
