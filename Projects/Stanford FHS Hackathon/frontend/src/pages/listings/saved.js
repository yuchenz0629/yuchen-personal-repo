import React, { useEffect, useState } from 'react';
import PropertyCardBuyer from '../../components/dashboard/PropertyCardBuyer';
import property1Image from '../../assets/property1.png';
import property2Image from '../../assets/property2.png';
const Saved = () => {
    const handleSaveProperty = (propertyId) => {
        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                property.id === propertyId ? { ...property, saved: !property.saved } : property
            )
        );
    };
    const [properties, setProperties] = useState([
        {
          id: 1,
          coverImage: property1Image,
          address: '123 Maple Street, Springfield, USA',
          price: 450000,
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1800,
          saved: true,
        },
        {
          id: 2,
          coverImage: property2Image,
          address: '456 Oak Avenue, Shelbyville, USA',
          price: 525000,
          bedrooms: 4,
          bathrooms: 3,
          squareFootage: 2200,
          saved: true,
        },
    ]);
    return (
        <div className="min-h-screen flex">
          <div className="flex-1 p-8 bg-white dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buyer Dashboard</h1>
            </div>
    
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Saved Listings
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {properties.map((property) => (
                    <PropertyCardBuyer
                    key={property.id}
                    {...property}
                    onSave={() => handleSaveProperty(property.id)}
                    />
                ))}
            </div>
          </div>
        </div>
    );
}

export default Saved;