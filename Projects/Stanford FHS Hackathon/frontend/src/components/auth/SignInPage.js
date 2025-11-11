import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-200/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-200/20 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-pink-200/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Home link */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors z-20"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </Link>

      {/* Sign In Component */}
      <div className="relative z-10">
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
};

export default SignInPage;
