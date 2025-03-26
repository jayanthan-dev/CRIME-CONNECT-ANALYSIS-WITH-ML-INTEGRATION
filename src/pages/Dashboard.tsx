import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Brain,
  MapPin,
  FileText,
  Users,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

// Expanded Mock Data
const MOCK_CRIME_DATA = {
  monthly_stats: [
    { month: 'Jan', cases: 120, resolved: 85, unresolved: 35 },
    { month: 'Feb', cases: 145, resolved: 102, unresolved: 43 },
    { month: 'Mar', cases: 135, resolved: 95, unresolved: 40 },
    { month: 'Apr', cases: 160, resolved: 112, unresolved: 48 },
    { month: 'May', cases: 175, resolved: 125, unresolved: 50 },
    { month: 'Jun', cases: 190, resolved: 138, unresolved: 52 }
  ],
  crime_types: [
    { type: 'Theft', count: 45 },
    { type: 'Assault', count: 30 },
    { type: 'Cybercrime', count: 20 },
    { type: 'Fraud', count: 15 },
    { type: 'Others', count: 10 }
  ],
  hotspots: [
    { id: 1, location: 'Central Market', incidents: 35, risk: 'High' },
    { id: 2, location: 'Downtown Area', incidents: 28, risk: 'Medium' },
    { id: 3, location: 'Industrial Zone', incidents: 22, risk: 'Low' },
    { id: 4, location: 'University Campus', incidents: 18, risk: 'Medium' }
  ],
  recent_reports: [
    { id: 1, title: 'Robbery at Convenience Store', status: 'investigating', location: 'Main Street', timestamp: '2h ago' },
    { id: 2, title: 'Cyber Fraud Case', status: 'pending', location: 'Online', timestamp: '1d ago' },
    { id: 3, title: 'Vehicle Theft', status: 'resolved', location: 'Parking Lot', timestamp: '3d ago' },
    { id: 4, title: 'Assault Report', status: 'investigating', location: 'Downtown', timestamp: '12h ago' }
  ],
  demographic_data: [
    { category: '18-25', percentage: 25 },
    { category: '26-35', percentage: 35 },
    { category: '36-45', percentage: 20 },
    { category: '46-55', percentage: 12 },
    { category: '55+', percentage: 8 }
  ]
};

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Resolved', value: 'resolved' }
  ];

  const toggleCardExpand = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Crime Analytics</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-200"
        >
          {isMobileMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white rounded-lg shadow-md p-4 mb-4"
        >
          <div className="flex flex-col space-y-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
              <Download size={18} />
              <span>Export</span>
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Crime Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">Comprehensive Crime Insights and Predictive Analysis</p>
          </div>
          <div className="flex space-x-2 md:space-x-4">
            <button className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm md:text-base">
              <Download size={18} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-300 transition text-sm md:text-base">
              <Search size={18} />
              <span className="hidden sm:inline">Advanced Search</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Mobile (Horizontal Scroll) */}
      <div className="md:hidden mb-4 overflow-x-auto pb-2">
        <div className="flex space-x-4 w-max">
          {[
            {
              id: 'active-cases',
              title: 'Active',
              value: '24',
              icon: Clock,
              color: 'bg-blue-500',
              trend: '+5%'
            },
            {
              id: 'resolved-cases',
              value: '156',
              icon: CheckCircle,
              color: 'bg-green-500',
              trend: '+12%'
            },
            {
              id: 'high-priority',
              value: '8',
              icon: AlertTriangle,
              color: 'bg-red-500',
              trend: '-2%'
            },
            {
              id: 'ai-accuracy',
              value: '89%',
              icon: Brain,
              color: 'bg-purple-500',
              trend: 'ML Model'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 min-w-[120px]"
              onClick={() => toggleCardExpand(stat.id)}
            >
              <div className="flex flex-col items-center">
                <div className={`${stat.color} p-2 rounded-lg mb-2`}>
                  <stat.icon className="text-white" size={18} />
                </div>
                <p className="text-sm text-gray-600 text-center">{stat.title || stat.id.split('-').join(' ')}</p>
                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      