// client/src/pages/PageNotFound.jsx

import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Frown className="w-24 h-24 text-purple-600 mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link
          to="/home"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
