import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Home,
  Users,
  Briefcase,
  MessageCircle,
  Store,
  Moon,
  Sun,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationBell } from '../notifications/NotificationBell';

interface HeaderProps {
  profile?: any;
  isOwner?: boolean;
  editMode?: boolean;
  isPreviewMode?: boolean;
  onToggleEdit?: () => void;
  onTogglePreview?: () => void;
  unreadCount?: number;
  loading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  profile,
  isOwner = false,
  editMode = false,
  isPreviewMode = false,
  onToggleEdit,
  onTogglePreview,
  unreadCount = 0,
  loading = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const avatarUrl = profile?.avatar || user?.profile?.avatar || '/assets/img/default-avatar.png';
  const nickname = profile?.nickname || user?.profile?.nickname || user?.username || 'User';

  if (loading) {
    return (
      <header className="fixed top-0 w-full z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/img/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">XCV</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/feed" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <Link to="/network" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <Link to="/jobs" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <Link to="/messages" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          {isOwner && (
            <Link to="/shop/me" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Store className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          {isAuthenticated && <NotificationBell unreadCount={unreadCount} />}

          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <img
                  src={avatarUrl}
                  alt={nickname}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
                  <Link
                    to={`/profile/${nickname}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/feed"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Feed</span>
            </Link>
            <Link
              to="/network"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-5 h-5" />
              <span>Network</span>
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>
            <Link
              to="/messages"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            {isOwner && (
              <Link
                to="/shop/me"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className="w-5 h-5" />
                <span>Store</span>
              </Link>
            )}
            <hr className="border-gray-200 dark:border-gray-700" />
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-center text-blue-600 hover:text-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;