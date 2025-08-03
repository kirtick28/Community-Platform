import { useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import PostCard from '../components/PostCard.jsx'
import { useData } from '../context/DataContext.jsx'

const HomePage = () => {
  const { posts, searchTerm, setSearchTerm } = useData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, users, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
            />
          </div>
        </div>

        {/* Feed Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Feed</h1>
          <p className="text-gray-600">Discover what's happening in your community</p>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share something!'}
              </p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage