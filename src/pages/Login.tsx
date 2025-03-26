import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Lock, AlertCircle, Map, Star, ChevronRight, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Animation state
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set animation as complete after initial load
    const timer = setTimeout(() => setAnimationComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0"
        >
          {/* Police-themed pattern overlay */}
          <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <pattern id="policePattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 0L40 0L40 40L0 40Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <path d="M20 20L25 15L20 10L15 15Z" fill="rgba(255,255,255,0.1)" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#policePattern)" />
          </svg>
        </motion.div>

        {/* Animated rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-indigo-500/20"
            initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 0 }}
            animate={{ 
              width: [0, 1000 + i * 200], 
              height: [0, 1000 + i * 200], 
              opacity: [0, 0.2, 0] 
            }}
            transition={{ 
              duration: 10, 
              delay: i * 2,
              repeat: Infinity,
              ease: "easeOut" 
            }}
          />
        ))}
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-blue-400/30 blur-sm"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        {/* Header shield animation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute top-8 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
            <Shield className="text-blue-400 mr-2" size={18} />
            <span className="text-white text-sm font-medium">Thoothukudi Police Department</span>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20 overflow-hidden"
        >
          {/* Logo/Badge */}
          <motion.div 
            className="text-center mb-8 relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {/* Rotating glow effect */}
              <motion.div 
                animate={{ 
                  rotate: 360,
                  transition: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 blur-xl"
              />
              
              {/* Badge background */}
              <motion.div
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative w-20 h-20 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-full flex items-center justify-center shadow-lg"
              >
                {/* Badge design */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-200/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50" />
                  <div className="absolute inset-2 rounded-full border border-blue-300/30" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1 }}
                >
                  <Shield className="text-white relative z-10" size={36} />
                  <Star className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-yellow-300" size={14} />
                </motion.div>
              </motion.div>
            </div>
            
            {/* Title with 3D-like text effect */}
            <div className="relative mt-4">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 bg-clip-text text-transparent relative z-10"
              >
                CrimeSpot
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute bottom-0 left-0"
              />
            </div>
            
            {/* Digital badge effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-2 flex justify-center"
            >
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Map size={14} className="text-blue-600 mr-1" />
                {/* <span className="text-sm font-medium text-blue-800">Secure Portal</span> */}
              </div>
            </motion.div>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 overflow-hidden"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form with enhanced animations */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 flex items-center">
                <User size={14} className="mr-1 text-blue-500" />
                Email
              </label>
              <div className="relative group">
                {/* Enhanced gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-25 group-hover:opacity-100 blur transition duration-200" />
                <div className="relative bg-white rounded-lg">
                  <User className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 flex items-center">
                <Key size={14} className="mr-1 text-blue-500" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-25 group-hover:opacity-100 blur transition duration-200" />
                <div className="relative bg-white rounded-lg">
                  <Lock className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit button with loading state */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign In</span>
                    <ChevronRight size={18} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                
                {/* Button hover effect */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-white/40"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </motion.div>
          </form>

          {/* Demo credentials with card effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-center text-sm font-medium text-gray-600 mb-2 flex items-center justify-center">
              <Lock size={14} className="mr-1 text-blue-500" />
              Demo Credentials
            </p>
            <div className="relative">
              {/* Card shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{
                  x: ["calc(-100%)", "calc(100%)"],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              />
              
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:justify-around space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={14} className="text-blue-500" />
                    </div>
                    <p className="text-sm">Admin: admin@gmail.com / 12345</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User size={14} className="text-indigo-500" />
                    </div>
                    <p className="text-sm">User: user@gmail.com / 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Footer with scanner line effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-4 border-t border-gray-100 text-center relative"
          >
            <motion.div
              className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full"
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [1, 2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <p className="text-xs text-gray-400 flex items-center justify-center">
              <Shield size={12} className="text-blue-400 mr-1" />
              Thoothukudi Police Department • Secure Login
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;