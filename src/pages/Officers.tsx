import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Mail, User, Award } from 'lucide-react';

const Officers: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedDivision, setSelectedDivision] = useState('All');

 const divisions = [
 'All',
 'Head Officers',
 'Thoothukudi',
 'Thoothukudi Rural',
 'Maniyachi',
 'Kovilpatti',
 'Vilathikulam',
 'Srivaikundam',
 'Thiruchendur',
 'Sattankulam',
 'PEW',
 'DCB',
 ];


 const officers = officersData.map((officer) => ({
 ...officer,
 name: officer.name || 'N/A',
 designation: officer.designation || null,
 landline: officer.landline || 'N/A',
 mobile: officer.mobile || 'N/A',
 email: officer.email || 'N/A',
 isIPS: officer.name.includes('IPS'),
 isHeadOfficer: officer.division === 'Head Officers'
 }));

 const filteredOfficers = officers.filter((officer) => {
 const matchesDivision =
 selectedDivision === 'All' || officer.division === selectedDivision;
 const matchesSearch =
 officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 (officer.station &&
 officer.station.toLowerCase().includes(searchTerm.toLowerCase())) ||
 officer.email.toLowerCase().includes(searchTerm.toLowerCase());
 return matchesDivision && matchesSearch;
 });

 const cardVariants = {
 hidden: { opacity: 0, y: 50 },
 visible: (index: number) => ({
 opacity: 1,
 y: 0,
 transition: {
 delay: index * 0.05,
 duration: 0.4,
 ease: 'easeInOut',
 },
 }),
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: 'easeInOut' }}
 className="max-w-7xl mx-auto space-y-8"
 >
 {/* Header Section */}
 <div className="text-center">
 <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
 Thoothukudi Officers Directory
 </h1>
 <p className="mt-2 text-lg text-gray-600">
 Find contact information for officers in various divisions.
 </p>
 </div>

 {/* Search and Filter Section */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
 <div className="flex w-full md:w-auto gap-4">
 <div className="relative flex-grow md:flex-grow-0">
 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
 <Search className="text-gray-400" size={20} />
 </div>
 <input
 type="text"
 placeholder="Search officers..."
 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="relative">
 <select
 className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
 value={selectedDivision}
 onChange={(e) => setSelectedDivision(e.target.value)}
 >
 {divisions.map((division) => (
 <option key={division} value={division}>
 {division}
 </option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
 <svg
 className="fill-current h-4 w-4"
 xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 20 20"
 >
 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
 </svg>
 </div>
 </div>
 </div>
 </div>

 {/* Officer Cards Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
 {filteredOfficers.map((officer, index) => (
 <motion.div
 key={index}
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 custom={index}
 className={`
 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300
 ${officer.isIPS ? 'border-4 border-gold-500' : ''}
 ${officer.isHeadOfficer ? 'bg-blue-50' : ''}
 `}
 >
 <div className="p-6 space-y-4">
 <div className="flex items-center space-x-4">
 <div className="relative">
 <img
 src="https://bitlinks.bitsathy.ac.in/static/media/user.900505a2e95287f7e05c.jpg"
 alt={officer.name}
 className={`
 w-16 h-16 rounded-full object-cover border-2
 ${officer.isIPS ? 'border-gold-500' : 'border-blue-200'}
 `}
 />
 {(officer.isIPS || officer.isHeadOfficer) && (
 <div className="absolute bottom-0 right-0">
 <Award 
 size={20} 
 className={`
 ${officer.isIPS ? 'text-gold-500' : 'text-blue-500'}
 `} 
 />
 </div>
 )}
 </div>
 <div>
 <div className="flex items-center">
 <h3 className="text-lg font-semibold text-gray-900">
 {officer.name}
 </h3>
 {officer.isIPS && (
 <span className="ml-2 px-2 py-1 bg-gold-100 text-gold-800 text-xs rounded-full">
 IPS
 </span>
 )}
 </div>
 {officer.designation && (
 <p className={`
 text-sm 
 ${officer.isHeadOfficer ? 'text-blue-600 font-semibold' : 'text-gray-500'}
 `}>
 {officer.designation}
 </p>
 )}
 <p className="text-sm text-gray-500">{officer.division}</p>
 </div>
 </div>

 <div className="space-y-2">
 {officer.station && (
 <div className="flex items-center text-gray-600">
 <MapPin size={18} className="mr-2 text-blue-400" />
 <span>{officer.station}</span>
 </div>
 )}
 {officer.landline !== 'N/A' && (
 <div className="flex items-center text-gray-600">
 <Phone size={18} className="mr-2 text-blue-400" />
 <span>{officer.landline}</span>
 </div>
 )}
 {officer.mobile !== 'N/A' && (
 <div className="flex items-center text-gray-600">
 <Phone size={18} className="mr-2 text-blue-400" />
 <span>{officer.mobile}</span>
 </div>
 )}
 {officer.email !== 'N/A' && (
 <div className="flex items-center text-gray-600">
 <Mail size={18} className="mr-2 text-blue-400" />
 <span>{officer.email}</span>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* No Officers Found Message */}
 {filteredOfficers.length === 0 && (
 <div className="text-center py-12">
 <p className="text-gray-500">
 No officers found matching your search criteria.
 </p>
 </div>
 )}
 </motion.div>
 </div>
 );
};

export default Officers;