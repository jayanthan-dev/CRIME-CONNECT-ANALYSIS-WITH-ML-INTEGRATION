import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <motion.main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default Layout