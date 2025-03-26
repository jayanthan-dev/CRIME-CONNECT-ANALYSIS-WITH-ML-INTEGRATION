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

 const officersData = [
    {
    division: 'Head Officers',
    name: 'Thiru Albert John IPS',
    designation: 'SUPERINTENDENT OF POLICE - SP',
    landline: '0461-2330111, 0461-2340200',
    mobile: '9876543210',
    email: 'spthoothukudicamp@gmail.com',
    },
    {
    division: 'Head Officers',
    name: 'Thiru Dheepu V K',
    designation: 'ADDITIONAL SUPERINTENDENT OF POLICE - ADSP',
    landline: '04612340300',
    mobile: '9498194825',
    email: 'adspcwctut@gmail.com',
    },
    {
    division: 'Head Officers',
    name: 'Thiru Arumugam N',
    designation: 'ADDITIONAL SUPERINTENDENT OF POLICE - ADSP',
    landline: '04612340300',
    mobile: '9442317751',
    email: 'adsphqtut@gmail.com',
    },
    {
    division: 'Head Officers',
    name: 'Thiru Sahaya Jose',
    designation: 'ADDITIONAL SUPERINTENDENT OF POLICE - ADSP',
    landline: '0461-2330111, 0461-2340200',
    mobile: '9498102858',
    email: 'test@gmail.com',
    },
    {
    division: 'Kovilpatti',
    name: 'Thiru Jaganathan',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '04632-220020, 9498101835',
    mobile: '9865695944',
    email: 'dspkvptut@gmail.com',
    },
    {
    division: 'Maniyachi',
    name: 'Thiru Arul',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '0461-2273252, 9498101836',
    mobile: '9498176611',
    email: 'dspmintut@yahoo.co.in',
    },
    {
    division: 'Sattankulam',
    name: 'Thiru Subakumar',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '04639-266665, 9498101838',
    mobile: '9498183830',
    email: 'dspskm@yahoo.in',
    },
    {
    division: 'Srivaikundam',
    name: 'Thiru Ramakrishnan',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '04630-255236, 9498101834',
    mobile: '9442587777',
    email: 'dspsrivai@yahoo.com',
    },
    {
    division: 'Thiruchendur',
    name: 'Thiru Maheshkumar M',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '046390-245100, 9498101833',
    mobile: '7708467248',
    email: 'dsptcr1@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    name: 'Thiru Sudheer',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '0461-2376093, 9498101832',
    mobile: '9688663177',
    email: 'dsptutrural@gmail.com',
    },
    {
    division: 'Vilathikulam',
    name: 'Thiru Asokan P',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '04638-233498, 9498101837',
    mobile: '8072667032',
    email: 'dspvkmtut26@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    name: 'Thiru Dr. C. Madhan IPS',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '0461-23752150, 9498101831',
    mobile: '6381214836',
    email: 'dsptutrural@gmail.com',
    },
    {
    division: 'PEW',
    name: 'Thiru Guruvenkatraj V',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '0461-2311000',
    mobile: '9498198131',
    email: 'dsppewtut@gmail.com',
    },
    {
    division: 'DCB',
    name: 'Thiru Raju. S',
    designation: 'DEPUTY SUPERINTENDENT OF POLICE - DSP',
    landline: '04612340585',
    mobile: '9498107588',
    email: 'dspdcbtut@yahoo.co.in',
    },
    {
    division: 'Thoothukudi',
    station: 'Muthiahpuram',
    name: 'Vacant',
    landline: '0461-2355311, 9498101859',
    mobile: '-',
    email: 'muthiahpuramps@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Thoothukudi Central',
    name: 'Basakaran G',
    landline: '0461-2321400, 9498101883',
    mobile: '9498193727',
    email: 'tutcentralps@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Thoothukudi North',
    name: 'Balamurugan V',
    landline: '0461-2320051, 9498101884',
    mobile: '9498163108',
    email: 'b1thoothukudi@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Thoothukudi South',
    name: 'Thirumurugan',
    landline: '0461-2321850, 9498101885',
    mobile: '9498193830',
    email: 'thoothukudisouthps@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Thermal Nagar',
    name: 'Shoba Jency A',
    landline: '0461-2352721, 9498101882',
    mobile: '9442302669',
    email: 'thermalnagar@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Awps-thoothukudi',
    name: 'Ramalakshmi A',
    landline: '0461-2337999, 9498101888',
    mobile: '9498184578',
    email: 'awpstut2337999@gmail.com',
    },
    {
    division: 'Thoothukudi',
    station: 'Thazhamuthunagar',
    name: 'Jeyanthi',
    landline: '0461-2360370, 9498101878',
    mobile: '9498197004',
    email: 'thalamuthunagar@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    station: 'Murappanadu',
    name: 'Sheik Abdhul Kadhar',
    landline: '04630-261229, 9498101858',
    mobile: '9498143651',
    email: 'murappanadups@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    station: 'Pudukkottai',
    name: 'Murugan',
    landline: '0461-2271230, 9498101866',
    mobile: '9498193270',
    email: 'pudukottaips@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    station: 'Sipcot',
    name: 'Syrus',
    landline: '0461-2341472, 9498101874',
    mobile: '9498194200',
    email: 'sipcotpolicestation@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    station: 'Thattaparai',
    name: 'Kumaresan N',
    landline: '0461-2261240, 9498101881',
    mobile: '9498194689',
    email: 'sic3ps@gmail.com',
    },
    {
    division: 'Thoothukudi Rural',
    station: 'Puthiamputhur',
    name: 'Jesline',
    landline: '0461-2261214, 9498101865',
    mobile: '9498108579',
    email: 'puthiamputhurps@gmail.com',
    },
    {
    division: 'Maniyachi',
    station: 'Maniyachi',
    name: 'Thomas',
    landline: '0461-2268226, 9498101855',
    mobile: '-',
    email: 'maniyachi@gmail.com',
    },
    {
    division: 'Maniyachi',
    station: 'Ottapidaram',
    name: 'Pavul Yesu Dhasan I',
    landline: '0461-2366238, 9498101863',
    mobile: '9498106349',
    email: 'insopmtut@yahoo.in',
    },
    {
    division: 'Maniyachi',
    station: 'Pasuvanthanai',
    name: 'Ramachandran U',
    landline: '0461-262225, 9498101864',
    mobile: '9498107732',
    email: 'h5pasuvanthanipstut@yahoo.com',
    },
    {
    division: 'Maniyachi',
    station: 'Kadambur',
    name: 'Kavitha',
    landline: '04632-246231, 9498101846',
    mobile: '9442853239',
    email: 'kadamburps@yahoo.com',
    },
    {
    division: 'Maniyachi',
    station: 'Puliyampatti',
    name: 'Ramesh Mohan R',
    landline: '0461-2273217, 9498101868',
    mobile: '9498192414',
    email: 'h2puliyampatti@gmail.com',
    },
    {
    division: 'Maniyachi',
    station: 'Naraikinaru',
    name: 'Rajadeva Prasath',
    landline: '0461-2273292, 9498101861',
    mobile: '9486919766',
    email: 'naraikinarups1997@gmail.com',
    },
    {
    division: 'Kovilpatti',
    station: 'Kovilpatti East',
    name: 'Jinna Beer Mohammed',
    landline: '04632-220050, 9498101850',
    mobile: '9498197572',
    email: 'kovilpattieastps2023@gmail.com',
    },
    {
    division: 'Kovilpatti',
    station: 'Kovilpatti West',
    name: 'Navaneethakrishnan K',
    landline: '04632-220048, 9498101851',
    mobile: '9498184748',
    email: 'kovilpattiwestps@gmail.com',
    },
    {
    division: 'Kovilpatti',
    station: 'Kalugumalai',
    name: 'Padmavathi S',
    landline: '04632-251201, 9498101847',
    mobile: '9498184217',
    email: 'kalugumalaips1872@yahoo.in',
    },
    {
    division: 'Kovilpatti',
    station: 'Kayathar',
    name: 'Sukadevi',
    landline: '04632-261232, 9498101848',
    mobile: '9498195599',
    email: 'kayatharps@gmail.com',
    },
    {
    division: 'Kovilpatti',
    station: 'Nalattinpudur',
    name: 'Arul Samraj D',
    landline: '04632-248740, 9498101860',
    mobile: '9498195739',
    email: 'nalattin@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Vilathikulam',
    name: 'Sakthivel A',
    landline: '04638-233125, 9498101887',
    mobile: '9498153052',
    email: 'vilathikulamps123@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Soorankudi',
    name: 'Siluvai Anthony R',
    landline: '04638-262300, 9498101875',
    mobile: '7418515734',
    email: 'soorankudips@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Pudur',
    name: 'Sundaram',
    landline: '04638-252240, 9498101867',
    mobile: '9600833686',
    email: 'pudurv3ps@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Sankaralingapuram',
    name: 'Murugesan',
    landline: '04638-242040, 9498101869',
    mobile: '9976655021',
    email: 'sankaipsv10@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Kadalkudi',
    name: 'Vinayagam',
    landline: '04638-291101, 9498101845',
    mobile: '9498195890',
    email: 'kadalkuduv4ps@gmail.com',
    },
    {
    division: 'Vilathikulam',
    station: 'Ettayapuram',
    name: 'Sundaramoorthy',
    landline: '04632-271201, 9498101844',
    mobile: '9498136507',
    email: 'ettayapurampsvkmtut@gmail.com',
    },
    {
    division: 'Srivaikundam',
    station: 'Alwarthirunagiri',
    name: 'Stellabai S',
    landline: '9498101839',
    mobile: '9498194380',
    email: 'shoalwar@gmail.com',
    },
    {
    division: 'Srivaikundam',
    station: 'Seidunganallur',
    name: 'Jeenkumar P',
    landline: '9498101872',
    mobile: '9498107695',
    email: 'inss2ps@gmail.com',
    },
    {
    division: 'Srivaikundam',
    station: 'Srivaikundam',
    name: 'Padmanaba Pillai',
    landline: '9498101876',
    mobile: '9444176622',
    email: 'srivaips@gmail.com',
    },
    {
    division: 'Srivaikundam',
    station: 'Kurumbur',
    name: 'Sivaraja',
    landline: '04639-235100, 9498101854',
    mobile: '9498104834',
    email: 'kurumburps@gmail.com',
    },
    {
    division: 'Srivaikundam',
    station: 'Sayarpuram',
    name: 'Antony Soosai Raj G',
    landline: '04630-273340, 9498101871',
    mobile: '9442138301',
    email: 'Sisawyer.ps@gmail.com',
    },
    {
    division: 'Thiruchendur',
    station: 'Kulasekarapattinam',
    name: 'Kannan M',
    landline: '04639-250286, 9498101852',
    mobile: '9498184054',
    email: 'f5kulasaips@gmail.com',
    },
    {
    division: 'Thiruchendur',
    station: 'Thiruchendur',
    name: 'Innosekumar P',
    landline: '04639-242241, 9498101886',
    mobile: '9498107695',
    email: 'tiruchendurp.s@gmail.com',
    },
    {
    division: 'Thiruchendur',
    station: 'Athoor',
    name: 'Mariappan',
    landline: '04639-238411, 9498101841',
    mobile: '8903546426',
    email: 'authoorps@gmail.com',
    },
    {
    division: 'Sattankulam',
    station: 'Meignanapuram',
    name: 'Shanmugaraj',
    landline: '04639-227233, 9498101857',
    mobile: '7678264387',
    email: 'megpsmegps220@gmail.com',
    },
    {
    division: 'Sattankulam',
    station: 'Nazareth',
    name: 'Gangainathapandiyan S',
    landline: '04639-277233, 9498101862',
    mobile: '8148200200',
    email: 'insprnaz@gmail.com',
    },
    {
    division: 'Sattankulam',
    station: 'Thattarmadam',
    name: 'Anitha M',
    landline: '04639-253244',
    mobile: '9498197517',
    email: 'tuttdmps@gmail.com',
    },
    {
    division: 'PEW',
    station: 'Pew-kovilpatti',
    name: 'Meeha R',
    landline: '04632-221247',
    mobile: '9498103021',
    email: 'kovilpatti.pew2023@gmail.com',
    },
    {
    division: 'DCB',
    station: 'Dcb',
    name: 'Lakshmi Prabha',
    landline: '0461-2340585',
    mobile: '9443507258',
    email: 'dspdcbtut@gmail.com',
    },
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