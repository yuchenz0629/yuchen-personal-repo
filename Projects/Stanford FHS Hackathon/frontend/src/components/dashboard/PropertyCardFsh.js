// src/components/PropertyCardFsh.js
import React from 'react';
import {
  HomeIcon,
  BuildingOfficeIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';

const PropertyCardFsh = ({
  coverImage,
  address,
  price,
  bedrooms,
  bathrooms,
  squareFootage,
  onRequestInfo, // Optional: Handler for the "Request Info" button
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <img src={coverImage} alt="Property" className="w-full h-40 object-cover" />
        {/* Removed the Save Button */}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
          {address}
        </h3>
        <p className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
          ${price.toLocaleString()}
        </p>
        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3">
          <div className="flex items-center mr-4">
            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
            <span>
              {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center mr-4">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>
              {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center">
            <Square3Stack3DIcon className="h-4 w-4 mr-1" />
            <span>{squareFootage.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={onRequestInfo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCardFsh;