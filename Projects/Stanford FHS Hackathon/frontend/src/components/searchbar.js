import React, { useState } from 'react';
const SearchBar = ({ onSearch }) => {
  const [category, setCategory] = useState('price');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (minValue && maxValue && parseInt(minValue) > parseInt(maxValue)) {
      alert('Minimum value cannot be greater than maximum value.');
      return;
    }
    let searchCriteria = {};
    switch (category) {
      case 'price':
        if (minValue) searchCriteria.minPrice = minValue;
        if (maxValue) searchCriteria.maxPrice = maxValue;
        break;
      case 'bedrooms':
        if (minValue) searchCriteria.minBedrooms = minValue;
        if (maxValue) searchCriteria.maxBedrooms = maxValue;
        break;
      case 'bathrooms':
        if (minValue) searchCriteria.minBathrooms = minValue;
        if (maxValue) searchCriteria.maxBathrooms = maxValue;
        break;
      case 'area':
        if (minValue) searchCriteria.minArea = minValue;
        if (maxValue) searchCriteria.maxArea = maxValue;
      default:
        break;
    }
    onSearch(searchCriteria);
  };

  const getMinLabel = () => {
    switch (category) {
      case 'price':
        return 'Min Price ($)';
      case 'bedrooms':
        return 'Min Bedrooms';
      case 'bathrooms':
        return 'Min Bathrooms';
      case 'area':
        return 'Min area (sqft)';
      default:
        return 'Min Value';
    }
  };

  const getMaxLabel = () => {
    switch (category) {
      case 'price':
        return 'Max Price ($)';
      case 'bedrooms':
        return 'Max Bedrooms';
      case 'bathrooms':
        return 'Max Bathrooms';
      case 'area':
        return 'Max area (sqft)';
      default:
        return 'Max Value';
    }
  };

  const getMinPlaceholder = () => {
    switch (category) {
      case 'price':
        return '100,000';
      case 'bedrooms':
        return '1';
      case 'bathrooms':
        return '1';
      case 'area':
        return '200';
      default:
        return '';
    }
  };

  const getMaxPlaceholder = () => {
    switch (category) {
      case 'price':
        return '500,000';
      case 'bedrooms':
        return '5';
      case 'bathrooms':
        return '4';
      case 'area':
        return '5000';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setMinValue('');
              setMaxValue('');
            }}
            className="w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white mr-2"
          >
            <option value="price">Price</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="bathrooms">Bathrooms</option>
            <option value="area">Area</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="minValue" className="text-gray-700 dark:text-gray-300 mr-2">
            {getMinLabel()}
          </label>
          <input
            type="number"
            id="minValue"
            name="minValue"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder={getMinPlaceholder()}
            className="w-30 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
            min="0"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="maxValue" className="text-gray-700 dark:text-gray-300 mr-2">
            {getMaxLabel()}
          </label>
          <input
            type="number"
            id="maxValue"
            name="maxValue"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder={getMaxPlaceholder()}
            className="w-30 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
            min="0"
          />
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-auto">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;