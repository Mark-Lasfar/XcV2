import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  profile?: any;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();
  const siteName = 'XCV';

  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} {siteName}. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/about"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              Terms
            </Link>
            <Link
              to="/help"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;