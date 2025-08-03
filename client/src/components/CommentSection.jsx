import { useState } from 'react';
import { Send, Reply, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CommentItem = ({ comment, onReply, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div
      className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}
    >
      <div className="flex space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {comment?.author?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {comment?.author?.name || 'Unknown'}
              </h4>
              <span className="text-gray-500 text-xs">
                {formatDate(comment?.createdAt)}
              </span>
            </div>
            <p className="text-gray-800 text-sm">{comment?.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-purple-600 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                />
                <button
                  onClick={handleReply}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {comment?.replies?.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ post }) => {
  const { user } = useAuth();
  const { addComment } = useData();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(post._id, newComment);
      setNewComment('');
    }
  };

  const handleReply = (parentCommentId, content) => {
    addComment(post._id, content, parentCommentId);
  };

  const comments = post?.comments || [];

  return (
    <div className="border-t border-gray-100 p-6 bg-gray-50">
      <h4 className="font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h4>

      {/* Add Comment Form */}
      {user && (
        <div className="mb-6">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
