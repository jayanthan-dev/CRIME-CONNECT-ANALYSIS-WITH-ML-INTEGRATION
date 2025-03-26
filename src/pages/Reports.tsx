import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Paperclip, Send, Eye, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const Reports: React.FC = () => {
  const [formData, setFormData] = useState({
    complainant_name: '',
    complainant_address: '',
    incident_date: '',
    incident_time: '',
    incident_location: '',
    incident_type: '',
    description: '',
    witnesses: '',
    evidence: [] as File[]
  });

  const [showFIRs, setShowFIRs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFIR, setSelectedFIR] = useState<any>(null);
  const FIRsPerPage = 9;

  const sampleFIRs = Array.from({ length: 50 }, (_, index) => ({
    id: `FIR-${1000 + index}`,
    complainant_name: `Complainant ${index + 1}`,
    complainant_address: `${['123 Main St', '456 Oak Ave', '789 Pine Rd', '101 Elm Blvd'][index % 4]}, City ${index % 10 + 1}`,
    incident_date: `2025-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    incident_time: `${String((index % 12) + 1).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}:00`,
    incident_location: `${['Downtown', 'Suburb', 'Industrial Area', 'Residential Zone'][index % 4]}, ${['North', 'South', 'East', 'West'][index % 4]} Sector`,
    incident_type: ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Fraud'][index % 5],
    status: ['Pending', 'Under Investigation', 'Resolved', 'Closed'][index % 4],
    priority: ['Low', 'Medium', 'High'][index % 3],
    description: `Detailed description of incident #${index + 1}. The incident involved ${['a stolen vehicle', 'a physical altercation', 'a break-in', 'property damage', 'financial fraud'][index % 5]}.`,
    witnesses: index % 3 === 0 ? 'None' : `John Doe (555-010${index % 10}), Jane Smith (555-020${index % 10})`,
    evidence: ['photo.jpg', 'document.pdf', 'video.mp4'].slice(0, (index % 3) + 1),
    officer_in_charge: `Officer ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][index % 5]}`
  }));

  const filteredFIRs = sampleFIRs.filter(fir => 
    fir.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fir.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fir.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fir.incident_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFIR = currentPage * FIRsPerPage;
  const indexOfFirstFIR = indexOfLastFIR - FIRsPerPage;
  const currentFIRs = filteredFIRs.slice(indexOfFirstFIR, indexOfLastFIR);
  const totalPages = Math.ceil(filteredFIRs.length / FIRsPerPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle FIR submission
    console.log('FIR Data:', formData);
    alert('FIR submitted successfully!');
    setFormData({
      complainant_name: '',
      complainant_address: '',
      incident_date: '',
      incident_time: '',
      incident_location: '',
      incident_type: '',
      description: '',
      witnesses: '',
      evidence: []
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        evidence: [...prev.evidence, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const toggleFIRs = () => {
    setShowFIRs(prev => !prev);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  const viewFIRDetails = (fir: any) => {
    setSelectedFIR(fir);
  };

  const closeFIRDetails = () => {
    setSelectedFIR(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File FIR</h1>
          <p className="mt-2 text-gray-600">Create a new First Information Report</p>
        </div>
        <button
          onClick={toggleFIRs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <FileText size={20} />
          {showFIRs ? 'Hide FIRs' : 'View All FIRs'}
        </button>
      </div>

      {showFIRs && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6 space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">FIR Records</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FIRs..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {filteredFIRs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FIRs found matching your search</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFIRs.map(fir => (
                  <motion.div
                    key={fir.id}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{fir.id}</h3>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            fir.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            fir.status === 'Under Investigation' ? 'bg-blue-100 text-blue-800' :
                            fir.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {fir.status}
                          </span>
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          fir.priority === 'High' ? 'bg-red-100 text-red-800' :
                          fir.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {fir.priority}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Complainant:</span>
                          <span className="truncate">{fir.complainant_name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Type:</span>
                          <span>{fir.incident_type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Date:</span>
                          <span>{fir.incident_date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium w-24">Location:</span>
                          <span className="truncate">{fir.incident_location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => viewFIRDetails(fir)}
                        className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedFIR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeFIRDetails}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{selectedFIR.id} - Details</h3>
                <button
                  onClick={closeFIRDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Complainant Information</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Name:</span> {selectedFIR.complainant_name}</p>
                        <p className="text-sm"><span className="font-medium">Address:</span> {selectedFIR.complainant_address}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Incident Details</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Type:</span> {selectedFIR.incident_type}</p>
                        <p className="text-sm"><span className="font-medium">Date:</span> {selectedFIR.incident_date}</p>
                        <p className="text-sm"><span className="font-medium">Time:</span> {selectedFIR.incident_time}</p>
                        <p className="text-sm"><span className="font-medium">Location:</span> {selectedFIR.incident_location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Case Information</h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            selectedFIR.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedFIR.status === 'Under Investigation' ? 'bg-blue-100 text-blue-800' :
                            selectedFIR.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedFIR.status}
                          </span>
                        </p>
                        <p className="text-sm"><span className="font-medium">Priority:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            selectedFIR.priority === 'High' ? 'bg-red-100 text-red-800' :
                            selectedFIR.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedFIR.priority}
                          </span>
                        </p>
                        <p className="text-sm"><span className="font-medium">Officer:</span> {selectedFIR.officer_in_charge}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Witnesses</h4>
                      <p className="mt-2 text-sm">{selectedFIR.witnesses}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Incident Description</h4>
                  <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedFIR.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Evidence Attachments</h4>
                  <ul className="mt-2 space-y-2">
                    {selectedFIR.evidence.map((file: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <Paperclip size={16} />
                        <a href="#" className="underline">{file}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeFIRDetails}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">FIR Form</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complainant Name*</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.complainant_name}
                onChange={e => setFormData(prev => ({ ...prev, complainant_name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complainant Address*</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.complainant_address}
                onChange={e => setFormData(prev => ({ ...prev, complainant_address: e.target.value }))}
                placeholder="Enter complete address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date*</label>
              <input
                type="date"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.incident_date}
                onChange={e => setFormData(prev => ({ ...prev, incident_date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Time*</label>
              <input
                type="time"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.incident_time}
                onChange={e => setFormData(prev => ({ ...prev, incident_time: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Location*</label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.incident_location}
                onChange={e => setFormData(prev => ({ ...prev, incident_location: e.target.value }))}
                placeholder="Where did the incident occur?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type*</label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.incident_type}
                onChange={e => setFormData(prev => ({ ...prev, incident_type: e.target.value }))}
              >
                <option value="">Select incident type</option>
                <option value="Theft">Theft</option>
                <option value="Assault">Assault</option>
                <option value="Burglary">Burglary</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Fraud">Fraud</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incident Description*</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed description of the incident..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Witnesses (if any)</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.witnesses}
              onChange={e => setFormData(prev => ({ ...prev, witnesses: e.target.value }))}
              placeholder="Enter witness details (name and contact information)"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Attachments</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 mt-3">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
            </div>

            {formData.evidence.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <ul className="space-y-2">
                  {formData.evidence.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Send size={18} />
              Submit FIR
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Reports;