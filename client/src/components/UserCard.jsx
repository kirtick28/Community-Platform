import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const truncateBio = (bio, limit = 100) => {
    if (!bio || bio.length <= limit) {
      return bio;
    }
    return `${bio.substring(0, limit)}...`;
  };

  const truncatedBio = truncateBio(user.bio);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-white dark:border-gray-800 shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
          </p>
          {truncatedBio && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
              {truncatedBio}
            </p>
          )}
        </div>
      </div>
      <Link
        to={`/u/${user.username}`}
        className="flex-shrink-0 sm:ml-4 self-end sm:self-auto"
      >
        <button className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 dark:bg-purple-700 rounded-full hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default UserCard;
