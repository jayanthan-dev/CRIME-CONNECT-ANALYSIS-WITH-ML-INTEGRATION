import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, BarChart, Bar
} from 'recharts';
import { 
  Calendar, ChevronDown, Filter, BarChart3, Activity, Layers, 
  AlertCircle, Clock, Shield, TrafficCone, TrendingUp, Users, 
  Map, CheckCircle, Smile, Frown, Meh, Download, RefreshCw, X
} from 'lucide-react';

// Mock data generator functions
const generateIncidentData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      violent: Math.floor(Math.random() * 20) + 30,
      nonViolent: Math.floor(Math.random() * 30) + 70,
      traffic: Math.floor(Math.random() * 20) + 50,
    });
  }
  
  return data;
};

const generateDistrictData = () => {
  const districts = ['North', 'South', 'East', 'West', 'Central'];
  return districts.map(district => ({
    district,
    clearance: Math.floor(Math.random() * 20) + 70,
    satisfaction: Math.floor(Math.random() * 15) + 80,
    response: Math.floor(Math.random() * 10) + 85,
    officers: Math.floor(Math.random() * 10) + 20,
  }));
};

const generateOfficerData = () => {
  const officers = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis'];
  return officers.map(name => ({
    name: `Officer ${name}`,
    cases: Math.floor(Math.random() * 20) + 10,
    clearance: Math.floor(Math.random() * 20) + 75,
    avgTime: (Math.random() * 10 + 5).toFixed(1),
  }));
};

const generateRecentIncidents = () => {
  const types = ['Theft', 'Assault', 'Fraud', 'Vandalism', 'DUI'];
  const statuses = ['Open', 'In Progress', 'Closed'];
  const districts = ['North', 'South', 'East', 'West', 'Central'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `CASE-${1000 + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    location: `${districts[Math.floor(Math.random() * districts.length)]} District`,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const Analytics: React.FC = () => {
  // State for filters
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    incidentType: '',
    status: '',
  });
  
  // State for data
  const [incidentTrendData, setIncidentTrendData] = useState<any[]>([]);
  const [districtPerformanceData, setDistrictPerformanceData] = useState<any[]>([]);
  const [officerPerformanceData, setOfficerPerformanceData] = useState<any[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  
  // Filter options
  const districtOptions = ['All', 'North', 'South', 'East', 'West', 'Central'];
  const incidentTypeOptions = ['All', 'Theft', 'Assault', 'Fraud', 'Vandalism', 'DUI'];
  const statusOptions = ['All', 'Open', 'In Progress', 'Closed'];

  // Summary stats
  const [summaryStats, setSummaryStats] = useState([
    { title: 'Total Incidents', value: '0', change: '+0%', trend: 'neutral', icon: <Activity className="text-blue-500" /> },
    { title: 'Clearance Rate', value: '0%', change: '+0%', trend: 'neutral', icon: <CheckCircle className="text-green-500" /> },
    { title: 'Avg Response Time', value: '0 min', change: '+0 min', trend: 'neutral', icon: <Clock className="text-yellow-500" /> },
    { title: 'Public Satisfaction', value: '0%', change: '+0%', trend: 'neutral', icon: <Smile className="text-purple-500" /> },
  ]);

  // Initialize data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const incidentData = generateIncidentData(days);
      const districtData = generateDistrictData();
      const officerData = generateOfficerData();
      const incidents = generateRecentIncidents();
      
      setIncidentTrendData(incidentData);
      setDistrictPerformanceData(districtData);
      setOfficerPerformanceData(officerData);
      setRecentIncidents(incidents);
      
      // Update summary stats
      const totalIncidents = incidentData.reduce((sum, day) => sum + day.violent + day.nonViolent + day.traffic, 0);
      const avgClearance = districtData.reduce((sum, district) => sum + district.clearance, 0) / districtData.length;
      const avgSatisfaction = districtData.reduce((sum, district) => sum + district.satisfaction, 0) / districtData.length;
      const avgResponse = (Math.random() * 5 + 7).toFixed(1);
      
      setSummaryStats([
        { 
          title: 'Total Incidents', 
          value: totalIncidents.toLocaleString(), 
          change: `${Math.floor(Math.random() * 10)}%`, 
          trend: Math.random() > 0.5 ? 'up' : 'down', 
          icon: <Activity className="text-blue-500" /> 
        },
        { 
          title: 'Clearance Rate', 
          value: `${Math.round(avgClearance)}%`, 
          change: `${Math.floor(Math.random() * 5)}%`, 
          trend: Math.random() > 0.5 ? 'up' : 'down', 
          icon: <CheckCircle className="text-green-500" /> 
        },
        { 
          title: 'Avg Response Time', 
          value: `${avgResponse} min`, 
          change: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 2).toFixed(1)} min`, 
          trend: Math.random() > 0.5 ? 'up' : 'down', 
          icon: <Clock className="text-yellow-500" /> 
        },
        { 
          title: 'Public Satisfaction', 
          value: `${Math.round(avgSatisfaction)}%`, 
          change: `${Math.floor(Math.random() * 5)}%`, 
          trend: Math.random() > 0.5 ? 'up' : 'down', 
          icon: <Smile className="text-purple-500" /> 
        },
      ]);
      
      setIsLoading(false);
    }, 800);
  };

  // Refresh data when time range changes
  useEffect(() => {
    refreshData();
  }, [timeRange]);

  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      refreshData();
      setShowFilters(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilters({
      district: '',
      incidentType: '',
      status: '',
    });
  };

  const filteredRecentIncidents = recentIncidents.filter(incident => {
    return (
      (filters.district === '' || incident.location.includes(filters.district)) &&
      (filters.incidentType === '' || incident.type === filters.incidentType) &&
      (filters.status === '' || incident.status === filters.status)
    );
  });

  const filteredOfficerData = officerPerformanceData; // Add officer filtering logic if needed

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Police Department Analytics</h1>
          <p className="mt-1 text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Time Range Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center bg-white rounded-lg shadow px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {timeRange === '7d' ? 'Last 7 days' : 
               timeRange === '30d' ? 'Last 30 days' : 
               timeRange === '90d' ? 'Last 90 days' : 'Custom'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            {showTimeRangeDropdown && (
              <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setTimeRange('7d');
                      setShowTimeRangeDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${timeRange === '7d' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('30d');
                      setShowTimeRangeDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${timeRange === '30d' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('90d');
                      setShowTimeRangeDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${timeRange === '90d' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Last 90 days
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Filters Button */}
          <button 
            className="flex items-center bg-white rounded-lg shadow px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          
          {/* Refresh Button */}
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center bg-white rounded-lg shadow px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {/* Export Button */}
          <button className="flex items-center bg-blue-600 rounded-lg shadow px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
              >
                {districtOptions.map(option => (
                  <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.incidentType}
                onChange={(e) => setFilters({...filters, incidentType: e.target.value})}
              >
                {incidentTypeOptions.map(option => (
                  <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option === 'All' ? '' : option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className={`mt-3 flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : stat.trend === 'down' ? (
                <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
              ) : (
                <span className="w-4 mr-1"></span>
              )}
              {stat.change}
              <span className="text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {['overview', 'incidents', 'performance', 'resources', 'officers', 'hotspots'].map((tab) => {
              const icons = {
                overview: <BarChart3 size={16} className="mr-2" />,
                incidents: <AlertCircle size={16} className="mr-2" />,
                performance: <TrendingUp size={16} className="mr-2" />,
                resources: <Layers size={16} className="mr-2" />,
                officers: <Users size={16} className="mr-2" />,
                hotspots: <Map size={16} className="mr-2" />,
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-5 font-medium text-sm border-b-2 flex items-center ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {icons[tab as keyof typeof icons]}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Monthly Incident Trends</h2>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                          Violent
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                          Non-Violent
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                          Traffic
                        </span>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={incidentTrendData}>
                          <defs>
                            <linearGradient id="colorViolent" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FEE2E2" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FEE2E2" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNonViolent" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#DBEAFE" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#DBEAFE" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D1FAE5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#D1FAE5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={{ stroke: '#E5E7EB' }} 
                            tick={{ fill: '#6B7280' }}
                          />
                          <YAxis 
                            tickLine={false} 
                            axisLine={{ stroke: '#E5E7EB' }} 
                            tick={{ fill: '#6B7280' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="violent" 
                            stroke="#EF4444" 
                            fillOpacity={1} 
                            fill="url(#colorViolent)" 
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="nonViolent" 
                            stroke="#3B82F6" 
                            fillOpacity={1} 
                            fill="url(#colorNonViolent)" 
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="traffic" 
                            stroke="#10B981" 
                            fillOpacity={1} 
                            fill="url(#colorTraffic)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">District Performance</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={districtPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                              dataKey="district" 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                              domain={[0, 100]}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Bar 
                              dataKey="clearance" 
                              name="Clearance Rate (%)" 
                              fill="#3B82F6" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Public Satisfaction</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={districtPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                              dataKey="district" 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                              domain={[0, 100]}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Bar 
                              dataKey="satisfaction" 
                              name="Satisfaction (%)" 
                              fill="#8B5CF6" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'incidents' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Incident Breakdown</h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        className={`px-3 py-1.5 text-sm rounded-lg ${timeRange === '7d' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 border'}`}
                        onClick={() => setTimeRange('7d')}
                      >
                        Daily
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-sm rounded-lg ${timeRange === '30d' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 border'}`}
                        onClick={() => setTimeRange('30d')}
                      >
                        Weekly
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-sm rounded-lg ${timeRange === '90d' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 border'}`}
                        onClick={() => setTimeRange('90d')}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Incidents by Type</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Theft', value: recentIncidents.filter(i => i.type === 'Theft').length },
                                { name: 'Assault', value: recentIncidents.filter(i => i.type === 'Assault').length },
                                { name: 'Fraud', value: recentIncidents.filter(i => i.type === 'Fraud').length },
                                { name: 'Vandalism', value: recentIncidents.filter(i => i.type === 'Vandalism').length },
                                { name: 'DUI', value: recentIncidents.filter(i => i.type === 'DUI').length },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value} cases`, 'Count']}
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Incidents by District</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'North', value: recentIncidents.filter(i => i.location.includes('North')).length },
                              { name: 'South', value: recentIncidents.filter(i => i.location.includes('South')).length },
                              { name: 'East', value: recentIncidents.filter(i => i.location.includes('East')).length },
                              { name: 'West', value: recentIncidents.filter(i => i.location.includes('West')).length },
                              { name: 'Central', value: recentIncidents.filter(i => i.location.includes('Central')).length },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                              dataKey="name" 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <YAxis 
                              tickLine={false} 
                              axisLine={{ stroke: '#E5E7EB' }} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              name="Incidents" 
                              fill="#3B82F6" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="text-md font-medium text-gray-900">Recent Incidents</h3>
                      <div className="text-sm text-gray-500">
                        Showing {filteredRecentIncidents.length} of {recentIncidents.length} incidents
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRecentIncidents.map((incident, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{incident.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  incident.status === 'Closed' ? 'bg-green-100 text-green-800' :
                                  incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {incident.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Clearance Rates by District</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={districtPerformanceData}>
                            <PolarGrid gridType="circle" stroke="#E5E7EB" />
                            <PolarAngleAxis 
                              dataKey="district" 
                              tick={{ fill: '#6B7280' }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <Radar
                              name="Clearance Rate"
                              dataKey="clearance"
                              stroke="#3B82F6"
                              fill="#3B82F6"
                              fillOpacity={0.4}
                              strokeWidth={2}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Response Scores by District</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={districtPerformanceData}>
                            <PolarGrid gridType="circle" stroke="#E5E7EB" />
                            <PolarAngleAxis 
                              dataKey="district" 
                              tick={{ fill: '#6B7280' }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fill: '#6B7280' }}
                            />
                            <Radar
                              name="Response Score"
                              dataKey="response"
                              stroke="#10B981"
                              fill="#10B981"
                              fillOpacity={0.4}
                              strokeWidth={2}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                      <h3 className="text-md font-medium text-gray-900">Officer Performance</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clearance Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOfficerData.map((officer, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{officer.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.cases}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        officer.clearance > 90 ? 'bg-green-500' :
                                        officer.clearance > 80 ? 'bg-blue-500' :
                                        officer.clearance > 70 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`} 
                                      style={{ width: `${officer.clearance}%` }}
                                    ></div>
                                  </div>
                                  <span>{officer.clearance}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.avgTime} min</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {officer.clearance > 90 ? (
                                  <Smile className="text-green-500" />
                                ) : officer.clearance > 80 ? (
                                  <Smile className="text-blue-500" />
                                ) : officer.clearance > 70 ? (
                                  <Meh className="text-yellow-500" />
                                ) : (
                                  <Frown className="text-red-500" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Resource Allocation</h2>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Officers by District</h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={districtPerformanceData}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                          <XAxis 
                            type="number" 
                            tickLine={false} 
                            axisLine={{ stroke: '#E5E7EB' }} 
                            tick={{ fill: '#6B7280' }}
                          />
                          <YAxis 
                            dataKey="district" 
                            type="category" 
                            tickLine={false} 
                            axisLine={{ stroke: '#E5E7EB' }} 
                            tick={{ fill: '#6B7280' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="officers" 
                            name="Officers" 
                            fill="#3B82F6" 
                            radius={[0, 4, 4, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;