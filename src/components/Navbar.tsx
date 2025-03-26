import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <motion.nav 
      className="bg-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">
              CrimeSpot - Thoothukudi Police
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {user?.name} ({user?.role})
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;