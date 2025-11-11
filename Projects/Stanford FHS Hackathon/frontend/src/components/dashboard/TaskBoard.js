import React from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

const TaskBoard = ({ tasks }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Task Board</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LightBulbIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{task.title}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              task.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
              'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
