import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const DocumentList = ({ documents }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Documents</h2>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LightBulbIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{doc.title}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              'bg-dark-100 bg-dark-800 text-purplw-800 dark:text-purple-300'
            }`}>
              {"View"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
