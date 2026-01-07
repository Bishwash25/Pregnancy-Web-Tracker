import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-10 bg-white relative z-10">
      <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 mb-4 sm:mb-6 md:mb-8">
            <Link to="/privacy" className="text-sm sm:text-base md:text-lg text-black hover:text-black transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm sm:text-base md:text-lg text-black hover:text-black transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm sm:text-base md:text-lg text-black hover:text-black transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-black">
            © {new Date().getFullYear()} Her Health. All rights reserved.
          </p>

      </div>
    </footer>
  );
};

export default Footer;
