// src/components/PropertyCardBuyer.js
import React from 'react';
import {
  HeartIcon,
  HomeIcon,
  BuildingOfficeIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

const PropertyCardBuyer = ({
  coverImage,
  address,
  price,
  bedrooms,
  bathrooms,
  squareFootage,
  saved,
  onSave,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="relative">
        <img src={coverImage} alt="Property" className="w-full h-48 object-cover" />
        <button
          onClick={onSave}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow"
          aria-label={saved ? 'Unsave Property' : 'Save Property'}
        >
          <HeartIcon
            className={`h-6 w-6 ${
              saved ? 'text-red-500' : 'text-gray-500 dark:text-gray-300'
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{address}</h3>
        <p className="font-semibold text-xl text-gray-900 dark:text-white mb-4">
          ${price.toLocaleString()}
        </p>
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4">
          <div className="flex items-center mr-4">
            <BuildingOfficeIcon className="h-5 w-5 mr-1" />
            <span>
              {bedrooms}B
            </span>
          </div>
          <div className="flex items-center mr-4">
            <HomeIcon className="h-5 w-5 mr-1" />
            <span>
              {bathrooms}Ba
            </span>
          </div>
          <div className="flex items-center">
            <Square3Stack3DIcon className="h-5 w-5 mr-1" />
            <span>{squareFootage.toLocaleString()} </span>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
          Request Info
        </button>
      </div>
    </div>
  );
};

export default PropertyCardBuyer;