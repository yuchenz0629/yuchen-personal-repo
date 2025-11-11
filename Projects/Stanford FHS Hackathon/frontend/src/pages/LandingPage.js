import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-200/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-200/20 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-pink-200/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-gray-900">A real estate marketplace</span>
          <br />
          <span className="text-gray-900">for the </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI era</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          The new, streamlined alternative to the traditional REALTOR® model. Whether you're buying, selling,
          or doing a bit of both, Homekey puts the entire process at your fingertips.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/sign-in"
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Get Started
          </Link>
          <button className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors border">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
