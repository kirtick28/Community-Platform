import { Link, useLocation } from 'react-router-dom'
import { Home, PlusSquare, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/posts', icon: PlusSquare, label: 'Post Management' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SocialHub
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {navItems.map(({ path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar