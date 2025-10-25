import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  User, 
  Lock, 
  AlertCircle, 
  ChevronRight, 
  Key, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Animation variants for better organization
const animationVariants = {
  container: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, delay: 0.2 }
  },
  header: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.7, ease: "easeOut" }
  },
  badge: {
    initial: { scale: 0.9, rotateY: 90 },
    animate: { scale: 1, rotateY: 0 },
    transition: { duration: 0.7, delay: 0.6 }
  },
  formField: (delay: number) => ({
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { delay, duration: 0.5 }
  }),
  button: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.7, duration: 0.5 }
  },
  error: {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  }
};

// Input field component for better reusability
interface InputFieldProps {
  type: 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
  label: string;
  required?: boolean;
  'aria-describedby'?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  label, 
  required = true,
  'aria-describedby': ariaDescribedBy
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 ml-1 flex items-center gap-1">
        <Icon size={14} className="text-blue-500" />
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      
      <div className="relative group">
        {/* Enhanced gradient border effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur transition-all duration-200"
          animate={{ 
            opacity: isFocused ? 0.4 : 0.1,
            scale: isFocused ? 1.02 : 1
          }}
        />
        
        <div className="relative bg-white rounded-lg">
          <Icon 
            className={`absolute left-3 top-3 transition-colors duration-200 ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`} 
            size={20} 
          />
          
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 pr-10 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={placeholder}
            required={required}
            aria-describedby={ariaDescribedBy}
            autoComplete={type === 'email' ? 'email' : 'current-password'}
          />
          
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Background animation component
const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Optimized pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }} 
        />
      </motion.div>

      {/* Animated rings - optimized */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 rounded-full border border-indigo-500/20"
          initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 0 }}
          animate={{ 
            width: [0, 800 + i * 200], 
            height: [0, 800 + i * 200], 
            opacity: [0, 0.3, 0] 
          }}
          transition={{ 
            duration: 8, 
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeOut" 
          }}
        />
      ))}
      
      {/* Reduced floating particles for performance */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/40 blur-sm"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            opacity: 0
          }}
          animate={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), 
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 12 + Math.random() * 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

// Enhanced badge component
const PoliceBadge: React.FC = () => {
  return (
    <motion.div 
      className="text-center mb-8 relative"
      variants={animationVariants.badge}
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
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-full flex items-center justify-center shadow-lg">
          {/* Badge design elements */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50" />
            <div className="absolute inset-2 rounded-full border border-blue-300/30" />
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1, stiffness: 200 }}
          >
            <Shield className="text-white relative z-10" size={36} />
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced title */}
      <div className="relative mt-4">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 bg-clip-text text-transparent relative z-10"
        >
          CrimeSpot Portal
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-600 mt-1"
        >
          Thoothukudi Police Department
        </motion.p>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute bottom-0 left-0"
        />
      </div>
    </motion.div>
  );
};

// Main Login component
const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { login } = useAuth();

  // Cleanup and optimization
  useEffect(() => {
    return () => {
      setError('');
      setIsLoading(false);
    };
  }, []);

  const handleInputChange = useCallback((field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error on input change
  }, [error]);

  const validateForm = useCallback((): boolean => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setIsSuccess(true);
        // Optional: Add success feedback before redirect
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        {/* Header */}
        <motion.header
          variants={animationVariants.header}
          initial="initial"
          animate="animate"
          className="absolute top-8 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
            <Shield className="text-blue-400 mr-2" size={18} />
            <span className="text-white text-sm font-medium">Thoothukudi Police Department</span>
          </div>
        </motion.header>

        {/* Main card */}
        <motion.main
          variants={animationVariants.container}
          initial="initial"
          animate="animate"
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20 overflow-hidden"
        >
          <PoliceBadge />

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                variants={animationVariants.error}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 overflow-hidden border border-red-200"
                role="alert"
                aria-describedby="error-message"
              >
                <AlertCircle size={20} className="flex-shrink-0" />
                <span id="error-message">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                variants={animationVariants.error}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 overflow-hidden border border-green-200"
                role="alert"
              >
                <CheckCircle size={20} className="flex-shrink-0" />
                <span>Login successful! Redirecting...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <motion.div variants={animationVariants.formField(0.5)}>
              <InputField
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
                icon={User}
                label="Email"
                aria-describedby={error ? "error-message" : undefined}
              />
            </motion.div>

            {/* Password field */}
            <motion.div variants={animationVariants.formField(0.6)}>
              <InputField
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter your password"
                icon={Key}
                label="Password"
                aria-describedby={error ? "error-message" : undefined}
              />
            </motion.div>

            {/* Submit button */}
            <motion.div
              variants={animationVariants.button}
              initial="initial"
              animate="animate"
              className="pt-2"
            >
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                aria-describedby="login-button-description"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Signing in...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle size={18} className="mr-2" />
                    <span>Success!</span>
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
              <span id="login-button-description" className="sr-only">
                Click to sign in to the police portal
              </span>
            </motion.div>
          </form>

          {/* Demo credentials */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-center text-sm font-medium text-gray-600 mb-3 flex items-center justify-center">
              <Lock size={14} className="mr-1 text-blue-500" />
              Demo Credentials
            </p>
            
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={12} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-blue-900">Admin</span>
                  </div>
                  <div className="text-xs text-blue-700 font-mono">
                    admin@gmail.com / 12345
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User size={12} className="text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium text-indigo-900">User</span>
                  </div>
                  <div className="text-xs text-indigo-700 font-mono">
                    user@gmail.com / 12345
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.footer 
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
              Secure Portal • Thoothukudi Police Department
            </p>
          </motion.footer>
        </motion.main>
      </div>
    </div>
  );
};

export default Login;