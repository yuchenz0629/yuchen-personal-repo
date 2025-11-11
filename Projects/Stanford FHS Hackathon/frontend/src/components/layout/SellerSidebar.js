import React, { useState } from 'react';
import { DocumentCurrencyDollarIcon, HomeIcon, ClipboardDocumentListIcon, DocumentIcon, CurrencyDollarIcon, ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const SellerSidebar = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', icon: HomeIcon, path: '/' },
    { name: 'Listings', icon: DocumentCurrencyDollarIcon, path: '/listings' },
    { name: 'Tasks', icon: ClipboardDocumentListIcon, path: '/tasks' },
    { name: 'Documents', icon: DocumentIcon, path: '/documents' },
    { name: 'Transactions', icon: CurrencyDollarIcon, path: '/transactions' },
    { name: 'Messages', icon: ChatBubbleLeftIcon, path: '/messages' },
  ];

  return (
    <>
      <div className="w-64 bg-white dark:bg-gray-800 min-h-screen p-4 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="mb-8">
          <img src="/homekey-logo.png" alt="Homekey Logo" className="w-36 h-auto mb-6" />
          {/* <button className="w-full bg-primary text-white rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-primary/90">
            <span>Add Listing</span>
          </button> */}
        </div>
        
        <nav>
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-200 ${location.pathname === item.path && "bg-gray-700"}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 z-50"
      >
        {isChatOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-start gap-2 mb-4">
              <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-900 dark:text-white">Hello! I'm your AI assistant, and I'll help you through the home selling process. Let's start with the initial setup. What's the address of the property you'd like to sell?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSidebar;
