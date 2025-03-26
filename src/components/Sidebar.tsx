import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Map, 
  FileText, 
  Users, 
  Settings, 
  BarChart2, 
  Shield,
  LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Map, label: 'Crime Map', path: '/crime-map' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    ...(user?.role === 'admin' ? [{ icon: Users, label: 'Officers', path: '/officers' }] : []),
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.div 
      className="bg-[#1a237e] text-white w-64 flex flex-col"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 flex items-center gap-3">
        <Shield size={32} />
        <span className="text-xl font-bold">CrimeSpot</span>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10' : 'hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;