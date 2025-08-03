import { useState } from 'react';
import { Plus, Edit3, Heart, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PostManagementCard from '../components/PostManagementCard.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import EditPostModal from '../components/EditPostModal.jsx';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const StatCard = ({ title, value, icon, iconBg }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none p-6 flex items-center space-x-4">
    <div
      className={`w-14 h-14 ${iconBg} dark:bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
    </div>
  </div>
);

const PostManagement = () => {
  const { user } = useAuth();
  const { allPosts } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // New state for editing

  const userPosts = allPosts.filter((post) => post.author._id === user?._id);
  const totalLikes = userPosts.reduce(
    (total, post) => total + post.likes.length,
    0
  );
  const totalComments = userPosts.reduce(
    (total, post) => total + post.comments.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your posts
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <StatCard
            title="Total Posts"
            value={userPosts.length}
            icon={
              <Edit3 className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            }
            iconBg="bg-purple-100 dark:bg-purple-900"
          />
          <StatCard
            title="Total Likes"
            value={totalLikes}
            icon={
              <Heart className="w-7 h-7 text-red-600 dark:text-red-400 fill-current" />
            }
            iconBg="bg-red-100 dark:bg-red-900"
          />
          <StatCard
            title="Total Comments"
            value={totalComments}
            icon={
              <MessageCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            }
            iconBg="bg-blue-100 dark:bg-blue-900"
          />
        </div>

        <div className="space-y-6">
          {userPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Edit3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start sharing your thoughts with the community!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post._id} className="relative group animate-slide-in">
                <PostManagementCard post={post} onEdit={setEditingPost} />
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default PostManagement;
