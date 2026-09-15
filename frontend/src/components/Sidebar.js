import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon,
  CarIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
  BarChart3Icon,
  SettingsIcon,
  ParkingSquareIcon,
  LogOutIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      name: 'Dashboard Overview',
      href: '/admin/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      name: 'Add Vehicle',
      href: '/admin/add-vehicle',
      icon: CarIcon,
    },
    {
      name: 'Active Vehicles',
      href: '/admin/active-vehicles',
      icon: ClockIcon,
    },
    {
      name: 'Completed Vehicles',
      href: '/admin/completed-vehicles',
      icon: CheckCircleIcon,
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCardIcon,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: BarChart3Icon,
    },
    {
      name: 'Rate Settings',
      href: '/admin/rate-settings',
      icon: SettingsIcon,
    },
    {
      name: 'Parking Capacity',
      href: '/admin/parking-capacity',
      icon: ParkingSquareIcon,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar Header */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Easy Park</span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${
                    isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="sidebar-item sidebar-item-inactive w-full text-left mt-8"
            >
              <LogOutIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                <span className="text-teal-700 dark:text-teal-300 font-medium text-sm">
                  {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {localStorage.getItem('username') || 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
