import React from 'react';

const StatCard = ({ icon: Icon, title, value, subtitle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
