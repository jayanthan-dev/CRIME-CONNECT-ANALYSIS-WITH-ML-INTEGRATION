import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Lock, 
  Zap,
  ChevronRight
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    highPriorityCases: true,
    weeklyReports: true,
    systemAlerts: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    anonymizeData: true
  });

  const [dashboardPreferences, setDashboardPreferences] = useState({
    defaultView: 'monthly',
    darkMode: false,
    refreshInterval: '15min'
  });

  const toggleSwitch = (category: string, setting: string) => {
    switch(category) {
      case 'notifications':
        setNotifications(prev => ({
          ...prev,
          [setting]: !prev[setting]
        }));
        break;
      case 'privacy':
        setPrivacySettings(prev => ({
          ...prev,
          [setting]: !prev[setting]
        }));
        break;
      case 'dashboard':
        setDashboardPreferences(prev => ({
          ...prev,
          [setting]: !prev[setting]
        }));
        break;
    }
  };

  const renderToggleSwitch = (isActive: boolean, onToggle: () => void) => (
    <div 
      className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out ${
        isActive ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onClick={onToggle}
    >
      <div 
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isActive ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
    </div>
  );

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    color, 
    children 
  }: { 
    icon: React.ComponentType<{ className?: string, size?: number }>, 
    title: string, 
    color: string, 
    children: React.ReactNode 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className={`flex items-center p-4 ${color} bg-opacity-10`}>
        <Icon className={`mr-3 ${color}`} size={24} />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard Settings</h1>
            <p className="mt-2 text-gray-600 text-lg">Customize your Crime Analytics experience</p>
          </div>
          <Settings className="text-gray-400" size={40} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Notifications Section */}
        <SettingCard 
          icon={Bell} 
          title="Notification Preferences" 
          color="text-blue-500"
        >
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center group">
              <span className="text-gray-700 capitalize group-hover:text-blue-600 transition">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              {renderToggleSwitch(value, () => toggleSwitch('notifications', key))}
            </div>
          ))}
        </SettingCard>

        {/* Privacy Settings */}
        <SettingCard 
          icon={Shield} 
          title="Privacy & Security" 
          color="text-green-500"
        >
          {Object.entries(privacySettings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center group">
              <span className="text-gray-700 capitalize group-hover:text-green-600 transition">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              {renderToggleSwitch(value, () => toggleSwitch('privacy', key))}
            </div>
          ))}
        </SettingCard>

        {/* Dashboard Preferences */}
        <SettingCard 
          icon={Zap} 
          title="Dashboard Preferences" 
          color="text-purple-500"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center group">
              <span className="text-gray-700 group-hover:text-purple-600 transition">Default View</span>
              <select 
                className="px-3 py-2 border rounded-md text-sm bg-gray-50 focus:ring-2 focus:ring-purple-300 transition"
                value={dashboardPreferences.defaultView}
                onChange={(e) => setDashboardPreferences(prev => ({
                  ...prev,
                  defaultView: e.target.value
                }))}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-gray-700 group-hover:text-purple-600 transition">Dark Mode</span>
              {renderToggleSwitch(
                dashboardPreferences.darkMode, 
                () => toggleSwitch('dashboard', 'darkMode')
              )}
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-gray-700 group-hover:text-purple-600 transition">Refresh Interval</span>
              <select 
                className="px-3 py-2 border rounded-md text-sm bg-gray-50 focus:ring-2 focus:ring-purple-300 transition"
                value={dashboardPreferences.refreshInterval}
                onChange={(e) => setDashboardPreferences(prev => ({
                  ...prev,
                  refreshInterval: e.target.value
                }))}
              >
                <option value="15min">15 Minutes</option>
                <option value="30min">30 Minutes</option>
                <option value="1hr">1 Hour</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </SettingCard>

        {/* User Profile Section */}
        <SettingCard 
          icon={User} 
          title="User Profile" 
          color="text-indigo-500"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" 
                placeholder="Crime Analyst"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition" 
                placeholder="analyst@crimedata.com"
              />
            </div>
          </div>
        </SettingCard>

        {/* Security Section */}
        <SettingCard 
          icon={Lock} 
          title="Security" 
          color="text-red-500"
        >
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition group">
              <span>Change Password</span>
              <ChevronRight className="group-hover:translate-x-1 transition" />
            </button>
            <button className="w-full flex items-center justify-between bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition group">
              <span>Two-Factor Authentication</span>
              <ChevronRight className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};

export default SettingsPage;