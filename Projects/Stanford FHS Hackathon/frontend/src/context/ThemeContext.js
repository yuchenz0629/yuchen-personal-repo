import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? savedTheme === 'dark' : prefersDark;
  });

  useEffect(() => {
    // Update document class and local storage when theme changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ToastContainer 
            position="top-right" // Set the position where the toast will appear
            autoClose={5000} // Auto-close the toast after 5 seconds
            hideProgressBar={false} // Show or hide the progress bar
            newestOnTop={false} // Stack new toasts on top
            closeOnClick={true} // Close the toast on click
            rtl={false} // Set to true for right-to-left languages
            pauseOnFocusLoss={false} // Pause toast when focus is lost
            draggable={true} // Allow toasts to be draggable
            pauseOnHover={true} // Pause toast on hover
          />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
