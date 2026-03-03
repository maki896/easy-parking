import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="text-6xl mb-4">🅿️</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The parking spot you requested seems to be empty.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline w-full flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Looking for something specific?</h3>
          <div className="space-y-2 text-left">
            <Link to="/" className="block text-primary-600 hover:text-primary-700 py-2">
              🏠 Homepage
            </Link>
            <Link to="/about" className="block text-primary-600 hover:text-primary-700 py-2">
              📖 About Us
            </Link>
            <Link to="/services" className="block text-primary-600 hover:text-primary-700 py-2">
              🛠 Services & Pricing
            </Link>
            <Link to="/testimony" className="block text-primary-600 hover:text-primary-700 py-2">
              💬 Testimonials
            </Link>
            <Link to="/contact" className="block text-primary-600 hover:text-primary-700 py-2">
              📩 Contact Us
            </Link>
            <Link to="/login" className="block text-primary-600 hover:text-primary-700 py-2">
              🔐 Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
