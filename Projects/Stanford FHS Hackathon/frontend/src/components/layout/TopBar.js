import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import pfp from '../../assets/profile.png'

const TopBar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    setIsSettingsOpen(false);
    navigate('/settings');
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/sign-in', {replace: true});
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 flex items-center justify-between transition-colors duration-200">
      {/* Logo and Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white"></h1>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <img
              src={pfp}
              alt={'User'}
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600"
            />
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dropdown Menu */}
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={handleSettingsClick}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
