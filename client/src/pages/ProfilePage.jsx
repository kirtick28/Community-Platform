import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Edit, Plus, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useAuth();
  const { allUsers, allPosts, loading } = useData();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!loading && allUsers.length > 0) {
      const foundUser = allUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      setProfileUser(foundUser);

      if (foundUser) {
        const postsOfUser = allPosts.filter(
          (post) => post.author._id === foundUser._id
        );
        setUserPosts(postsOfUser);
      }
      setProfileLoading(false);
    }
  }, [username, allUsers, allPosts, loading]);

  const isOwner =
    loggedInUser?.username.toLowerCase() === username.toLowerCase();

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleFollow = () => {
    console.log(`Follow user: ${username}`);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          User Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The profile you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none overflow-hidden mb-8 animate-fade-in-down">
          <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative">
            <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-2">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800">
                {profileUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="pt-20 p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {profileUser.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  @{profileUser.username}
                </p>
              </div>
              <div>
                {isOwner ? (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : null}
              </div>
            </div>

            {profileUser.bio && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mb-6">
                {profileUser.bio}
              </p>
            )}

            <div className="flex space-x-8 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userPosts.length}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Posts
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Posts by {profileUser.name}
          </h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <User className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isOwner
                  ? 'You have no posts yet.'
                  : `${profileUser.name} has no posts yet.`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwner
                  ? 'Share your first post to get started!'
                  : 'Check back later for new content.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {isOwner && showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
