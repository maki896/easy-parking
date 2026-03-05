import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { 
  MenuIcon, 
  XIcon, 
  LogOutIcon, 
  UserIcon,
  HomeIcon,
  BarChart3Icon
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  const publicLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Testimony', href: '/testimony' },
    { name: 'Contact', href: '/contact' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3Icon },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={isAuthenticated ? '/admin/dashboard' : '/'}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Easy Park</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAdminRoute && (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`navbar-link ${
                      location.pathname === link.href ? 'navbar-link-active' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <ThemeToggle />
                
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="btn btn-primary"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/admin/dashboard"
                      className="btn btn-outline"
                    >
                      Dashboard
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                        <UserIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{user?.username}</span>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-gray-800 dark:border-gray-700">
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <LogOutIcon className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {isAdminRoute && (
              <div className="flex items-center space-x-4">
                {adminLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center space-x-2 navbar-link ${
                      location.pathname === link.href ? 'navbar-link-active' : ''
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 btn btn-outline"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 p-2"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAdminRoute && (
                <>
                  {publicLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`block px-3 py-2 rounded-lg text-base font-medium ${
                        location.pathname === link.href
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="block px-3 py-2 btn btn-primary text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 btn btn-outline text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      >
                        <LogOutIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </>
              )}
              
              {isAdminRoute && (
                <>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                        location.pathname === link.href
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left btn btn-outline"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
