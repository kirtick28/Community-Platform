import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';

const EditPostModal = ({ post, onClose }) => {
  const { updatePost } = useData();
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const maxCharacters = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || content === post.content) return;

    setLoading(true);
    await updatePost(post._id, content);
    setLoading(false);
    onClose();
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setContent(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Update your post
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Share your thoughts with the community..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg leading-relaxed"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length} characters
              </span>
              <span
                className={`text-sm ${
                  content.length > maxCharacters
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {maxCharacters - content.length} remaining
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !content.trim() ||
                content.length > maxCharacters ||
                content === post.content
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
