import React, { useEffect, useState } from 'react';
import PropertyCardBuyer from '../../components/dashboard/PropertyCardBuyer';
import property2Image from '../../assets/property2.png';
import { toast } from 'react-toastify';
import SearchBar from '../../components/searchbar';

export default function Search() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const getAllListings = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:5001/listings/get_all_listings?user_id=${userId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch property listings.');
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const listings = await getAllListings();
      setAllListings(listings);
      setFilteredListings(listings);
    };
    fetchData();
  }, []);

  const handleSearch = ({ 
    minPrice, maxPrice, 
    minBedrooms, maxBedrooms, 
    minBathrooms, maxBathrooms, 
    minArea, maxArea
  }) => {
    let filtered = allListings;
    if (minPrice) {
      filtered = filtered.filter((property) => parseFloat(property.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((property) => parseFloat(property.price) <= parseFloat(maxPrice));
    }
    if (minBedrooms) {
      filtered = filtered.filter((property) => parseInt(property.bedrooms) >= parseInt(minBedrooms));
    }
    if (maxBedrooms) {
      filtered = filtered.filter((property) => parseInt(property.bedrooms) <= parseInt(maxBedrooms));
    }
    if (minBathrooms) {
      filtered = filtered.filter((property) => parseInt(property.bathrooms) >= parseInt(minBathrooms));
    }
    if (maxBathrooms) {
      filtered = filtered.filter((property) => parseInt(property.bathrooms) <= parseInt(maxBathrooms));
    }
    if (minArea) {
      filtered = filtered.filter((property) => parseInt(property.squarefootage) >= parseInt(minArea));
    }
    if (maxArea) {
      filtered = filtered.filter((property) => parseInt(property.squarefootage) <= parseInt(maxArea));
    }
    setFilteredListings(filtered);
  };

  const handleSave = (propertyId) => {
    const updatedListings = filteredListings.map((property) => {
      if (property.id === propertyId) {
        return { ...property, saved: !property.saved };
      }
      return property;
    });
    setFilteredListings(updatedListings);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Listings</h1>
        </div>

        <SearchBar onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-8">
          <h5 className="text-xl font-bold text-gray-900 dark:text-white">Search Results</h5>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((property) => (
              <PropertyCardBuyer
                key={property.id}
                coverImage={property2Image}
                address={property.address}
                price={parseFloat(property.price)}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                squareFootage={property.squarefootage}
                saved={property.saved || false}
                onSave={() => handleSave(property.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No properties found.</p>
          )}
        </div>
      </div>
    </div>
  );
}