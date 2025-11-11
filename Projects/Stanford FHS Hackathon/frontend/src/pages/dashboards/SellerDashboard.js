import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import TaskBoard from '../../components/dashboard/TaskBoard';
import DocumentList from '../../components/dashboard/DocumentList';
import { HomeIcon, ClockIcon, CurrencyDollarIcon, DocumentIcon } from '@heroicons/react/24/outline';
import PropertyCardSeller from '../../components/dashboard/PropertyCardSeller';

const SellerDashboard = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '5',
      subtitle: '3 Active, 2 In Escrow',
      icon: HomeIcon,
    },
    {
      title: 'Average Days on Market',
      value: '28',
      subtitle: '↓ 12% from last month',
      icon: ClockIcon,
    },
    {
      title: 'Total Portfolio Value',
      value: '$4.2M',
      subtitle: '↑ 8% from initial listing',
      icon: CurrencyDollarIcon,
    },
    {
      title: 'Properties in Escrow',
      value: '2',
      subtitle: '$1.5M total value',
      icon: DocumentIcon,
    },
  ];

  const properties = [
    {
      address: '123 Main St',
      status: 'Active',
      price: 750000,
      daysListed: 15,
      engagement: 89,
    },
    {
      address: '456 Oak Ave',
      status: 'In Escrow',
      price: 625000,
      daysListed: 45,
      engagement: 76,
    },
  ];

  const tasks = [
    { title: 'Schedule home inspection', status: 'In Progress' },
    { title: 'Review and sign disclosure documents', status: 'Pending' },
    { title: 'Prepare for open house', status: 'Completed' },
  ];

  const documents = [
    { title: 'Purchase Agreement' },
    { title: 'Property Disclosure' },
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Dashboard</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Active Listings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {properties.map((property, index) => (
          <PropertyCardSeller key={index} {...property} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tasks and Documents</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskBoard tasks={tasks} />
        <DocumentList documents={documents} />
      </div>
    </div>
  );
};

export default SellerDashboard;
