import { useState } from 'react'
import { Heart, MessageCircle, Clock, MoreVertical } from 'lucide-react'
import CommentSection from './CommentSection.jsx'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const PostCard = ({ post, showManagement = false }) => {
  const { user } = useAuth()
  const { toggleLike } = useData()
  const [showComments, setShowComments] = useState(false)

  const isLiked = post.likes.includes(user?.id)
  const isOwner = post.userId === user?.id

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleLike = () => {
    toggleLike(post.id)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {post.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.name}</h3>
              <p className="text-gray-500 text-sm">@{post.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <p className="text-gray-800 leading-relaxed text-lg">{post.content}</p>
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
              <span className="font-medium">{post.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.comments.length}</span>
            </button>
          </div>

          {showManagement && isOwner && (
            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection 
          post={post} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  )
}

export default PostCard