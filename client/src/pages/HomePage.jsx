import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx'; // Use the new PostCard
import UserCard from '../components/UserCard.jsx';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const HomePage = () => {
  const {
    posts,
    filteredPosts,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    loading
  } = useData();
  const { user } = useAuth();

  // Determine which posts to display: filtered posts if searchTerm is active, otherwise all posts.
  const displayPosts = searchTerm ? filteredPosts : posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header and Search Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hello, {user?.name || 'Welcome Back!'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover what's new and connect with your community.
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, users, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base shadow-sm"
            />
          </div>
        </div>

        {/* Conditional Rendering based on Search Term */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-pulse flex items-center justify-center space-x-2">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900">
              Loading content...
            </h3>
          </div>
        ) : searchTerm ? (
          // Display search results
          <div className="space-y-8">
            {/* Users Section */}
            {filteredUsers.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Users</h2>
                <div className="space-y-4">
                  {filteredUsers.map((u) => (
                    <UserCard key={u._id} user={u} />
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {filteredPosts.length > 0 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {filteredUsers.length === 0 && filteredPosts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Display all posts if no search term is active
          <div className="space-y-6">
            {displayPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  Be the first to share something!
                </p>
              </div>
            ) : (
              displayPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
