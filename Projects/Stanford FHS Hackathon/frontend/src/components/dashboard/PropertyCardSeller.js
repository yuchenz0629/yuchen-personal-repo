import React from 'react';
import { EyeIcon, ClockIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const PropertyCardSeller = ({ address, status, price, daysListed, engagement }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{address}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            status === 'Active' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
          }`}>
            {status}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <EyeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
          <p className="font-semibold text-gray-900 dark:text-white">${price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Days Listed</p>
          <p className="font-semibold text-gray-900 dark:text-white">{daysListed}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Engagement</p>
          <p className="font-semibold text-gray-900 dark:text-white">{engagement}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price Trend</p>
          <div className="h-6 flex items-center">
            <svg className="w-16 h-4" viewBox="0 0 64 16">
              <path
                d="M0 8 L16 12 L32 4 L48 8 L64 6"
                fill="none"
                stroke="#FF4405"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSeller;
