import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Paperclip, Send, Eye, X, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Attachment {
  id: number;
  file_path: string;
  file_type: string;
}

interface FIRType {
  id: number;
  complainant_name: string;
  complainant_address: string;
  complainant_phone?: string;
  complainant_email?: string;
  incident_date: string;
  incident_time: string;
  location: string;
  incident_type: string;
  description: string;
  witnesses: string;
  status: string;
  priority: string;
  Attachments?: Attachment[];
}

const Reports: React.FC = () => {
  const [formData, setFormData] = useState({
    complainant_name: "",
    complainant_address: "",
    complainant_phone: "",
    complainant_email: "",
    incident_date: "",
    incident_time: "",
    incident_location: "",
    incident_type: "",
    description: "",
    witnesses: "",
    priority: "Medium",
    evidence: [] as File[],
  });

  const [showFIRs, setShowFIRs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFIR, setSelectedFIR] = useState<FIRType | null>(null);
  const [allFIRs, setAllFIRs] = useState<FIRType[]>([]);
  const FIRsPerPage = 6;

  const fetchFIRs = async () => {
    try {
      const res = await fetch("http://localhost:4500/api/firs");
      const data: FIRType[] = await res.json();
      setAllFIRs(data.reverse());
    } catch (err) {
      console.error(err);
      alert("Failed to fetch FIRs");
    }
  };

  useEffect(() => {
    if (showFIRs) fetchFIRs();
  }, [showFIRs]);

  const filteredFIRs = allFIRs.filter(
    (fir) =>
      fir.id.toString().includes(searchTerm.toLowerCase()) ||
      fir.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fir.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fir.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFIR = currentPage * FIRsPerPage;
  const indexOfFirstFIR = indexOfLastFIR - FIRsPerPage;
  const currentFIRs = filteredFIRs.slice(indexOfFirstFIR, indexOfLastFIR);
  const totalPages = Math.ceil(filteredFIRs.length / FIRsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "evidence") form.append(key, value as string);
      });
      formData.evidence.forEach((file) => form.append("evidence", file));

      const response = await fetch("http://localhost:4500/api/firs", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (response.ok) {
        alert(`FIR submitted successfully! ID: ${result.fir_id}`);
        setFormData({
          complainant_name: "",
          complainant_address: "",
          complainant_phone: "",
          complainant_email: "",
          incident_date: "",
          incident_time: "",
          incident_location: "",
          incident_type: "",
          description: "",
          witnesses: "",
          priority: "Medium",
          evidence: [],
        });
        fetchFIRs();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit FIR.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        evidence: [...prev.evidence, ...Array.from(e.target.files)],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }));
  };

  const toggleFIRs = () => {
    setShowFIRs((prev) => !prev);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const viewFIRDetails = (fir: FIRType) => setSelectedFIR(fir);
  const closeFIRDetails = () => setSelectedFIR(null);

  return (
    <motion.div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">File FIR</h1>
          <p className="mt-2 text-gray-600">Create a new First Information Report</p>
        </div>
        <button onClick={toggleFIRs} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FileText size={20} /> {showFIRs ? "Hide FIRs" : "View All FIRs"}
        </button>
      </div>

      {/* FIR List */}
      {showFIRs && (
        <motion.div className="bg-white rounded-xl shadow-lg p-6 mt-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">FIR Records</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FIRs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
          </div>

          {filteredFIRs.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No FIRs found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFIRs.map((fir) => (
                <motion.div key={fir.id} whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} className="bg-white rounded-xl border p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{fir.id}</h3>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        fir.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        fir.status === "under investigation" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>{fir.status}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      fir.priority === "High" ? "bg-red-100 text-red-800" :
                      fir.priority === "Medium" ? "bg-orange-100 text-orange-800" :
                      "bg-green-100 text-green-800"
                    }`}>{fir.priority}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p><span className="font-medium">Complainant:</span> {fir.complainant_name}</p>
                    <p><span className="font-medium">Type:</span> {fir.incident_type}</p>
                    <p><span className="font-medium">Date:</span> {fir.incident_date}</p>
                    <p><span className="font-medium">Location:</span> {fir.location}</p>
                  </div>

                  <button onClick={() => viewFIRDetails(fir)} className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Eye size={16} /> View Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}><ChevronLeft /></button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight /></button>
            </div>
          )}
        </motion.div>
      )}

      {/* FIR Details Modal */}
      <AnimatePresence>
        {selectedFIR && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeFIRDetails}>
            <motion.div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                <h3 className="text-xl font-bold">FIR #{selectedFIR.id} Details</h3>
                <button onClick={closeFIRDetails}><X size={24} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p><span className="font-medium">Complainant:</span> {selectedFIR.complainant_name}</p>
                  <p><span className="font-medium">Address:</span> {selectedFIR.complainant_address}</p>
                  {selectedFIR.complainant_phone && <p><span className="font-medium">Phone:</span> {selectedFIR.complainant_phone}</p>}
                  {selectedFIR.complainant_email && <p><span className="font-medium">Email:</span> {selectedFIR.complainant_email}</p>}
                </div>
                <div>
                  <p><span className="font-medium">Type:</span> {selectedFIR.incident_type}</p>
                  <p><span className="font-medium">Date:</span> {selectedFIR.incident_date}</p>
                  <p><span className="font-medium">Time:</span> {selectedFIR.incident_time}</p>
                  <p><span className="font-medium">Location:</span> {selectedFIR.location}</p>
                  <p><span className="font-medium">Priority:</span> {selectedFIR.priority}</p>
                  <p><span className="font-medium">Status:</span> {selectedFIR.status}</p>
                  <p><span className="font-medium">Witnesses:</span> {selectedFIR.witnesses}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="bg-gray-50 p-4 rounded">{selectedFIR.description}</p>
              </div>

              {selectedFIR.Attachments && selectedFIR.Attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Attachments</h4>
                  <ul className="space-y-2">
                    {selectedFIR.Attachments.map(att => (
                      <li key={att.id}>
                        <a href={`http://localhost:4500/${att.file_path}`} target="_blank" className="text-blue-600 underline flex items-center gap-2" rel="noreferrer">
                          <Paperclip size={16} /> {att.file_path.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIR Form */}
      {!showFIRs && (
        <motion.form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Complainant Name" value={formData.complainant_name} onChange={e => setFormData({ ...formData, complainant_name: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Complainant Address" value={formData.complainant_address} onChange={e => setFormData({ ...formData, complainant_address: e.target.value })} required className="p-2 border rounded" />
            <input type="tel" placeholder="Phone" value={formData.complainant_phone} onChange={e => setFormData({ ...formData, complainant_phone: e.target.value })} className="p-2 border rounded" />
            <input type="email" placeholder="Email" value={formData.complainant_email} onChange={e => setFormData({ ...formData, complainant_email: e.target.value })} className="p-2 border rounded" />
            <input type="date" value={formData.incident_date} onChange={e => setFormData({ ...formData, incident_date: e.target.value })} required className="p-2 border rounded" />
            <input type="time" value={formData.incident_time} onChange={e => setFormData({ ...formData, incident_time: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Location" value={formData.incident_location} onChange={e => setFormData({ ...formData, incident_location: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Incident Type" value={formData.incident_type} onChange={e => setFormData({ ...formData, incident_type: e.target.value })} required className="p-2 border rounded" />
          </div>
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required className="p-2 border rounded w-full" />
          <input type="text" placeholder="Witnesses" value={formData.witnesses} onChange={e => setFormData({ ...formData, witnesses: e.target.value })} className="p-2 border rounded w-full" />
          <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="p-2 border rounded">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <div>
            <label className="block mb-1 font-medium">Attachments</label>
            <input type="file" multiple onChange={handleFileChange} className="mb-2" />
            {formData.evidence.length > 0 && (
              <ul className="space-y-1">
                {formData.evidence.map((file, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-50 p-1 rounded">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeFile(idx)} className="text-red-500 font-bold">X</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2">
            <Send size={16} /> Submit FIR
          </button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default Reports;
