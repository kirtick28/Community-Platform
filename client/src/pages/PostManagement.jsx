import { useState } from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import PostCard from '../components/PostCard.jsx'
import CreatePostModal from '../components/CreatePostModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const PostManagement = () => {
  const { user } = useAuth()
  const { allPosts, deletePost } = useData()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const userPosts = allPosts.filter(post => post.userId === user?.id)

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Management</h1>
            <p className="text-gray-600">Create and manage your posts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userPosts.reduce((total, post) => total + post.likes.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-red-600 text-xl">❤️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userPosts.reduce((total, post) => total + post.comments.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Edit3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your thoughts with the community!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            userPosts.map(post => (
              <div key={post.id} className="relative">
                <PostCard post={post} showManagement={true} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default PostManagement