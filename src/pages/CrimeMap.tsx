import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Map, { Marker, Popup } from "react-map-gl";
import { Users, MapPin, CheckCircle } from "lucide-react";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic21pbGVlZSIsImEiOiJjbThuejMzMjIwNHJvMmpzNXd6MXNtZnM4In0.rsQhRY5hN4lS3SeCL0ZXRA";

const CrimeMap: React.FC = () => {
  const [viewState, setViewState] = useState({
    latitude: 8.7642,
    longitude: 78.1348,
    zoom: 10,
  });

  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);
  const [showPatrolModal, setShowPatrolModal] = useState(false);
  const [patrolPlan, setPatrolPlan] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const MOCK_CRIME_DATA = {
    hotspots: [
      { id: 1, lat: 8.7642, lng: 78.1348, location: "Thoothukudi City", incidents: 15 },
      { id: 2, lat: 8.5833, lng: 78.1167, location: "Tiruchendur", incidents: 8 },
      { id: 3, lat: 8.8, lng: 78.15, location: "Kayalpattinam", incidents: 5 },
      { id: 4, lat: 8.6333, lng: 77.9833, location: "Srivaikuntam", incidents: 7 },
      { id: 5, lat: 8.7167, lng: 78.0833, location: "Ettayapuram", incidents: 4 },
    ],
  };

  const fetchPatrolPlan = async () => {
    try {
      const res = await axios.post("http://localhost:4500/api/allocate-patrol", {
        hotspots: MOCK_CRIME_DATA.hotspots,
      });
      const plan = res.data.patrolPlan || [];
      setPatrolPlan(plan);
      localStorage.setItem("patrolPlan", JSON.stringify(plan));
    } catch (err) {
      console.error("Backend unavailable — using local AI logic");
      const mockPlan = MOCK_CRIME_DATA.hotspots.map((h) => ({
        ...h,
        recommendedOfficers: Math.ceil(h.incidents / 5),
        recommendedTime: h.incidents > 10 ? "Night Shift" : "Day Shift",
        priority: h.incidents > 10 ? "High" : h.incidents > 6 ? "Medium" : "Low",
      }));
      setPatrolPlan(mockPlan);
      localStorage.setItem("patrolPlan", JSON.stringify(mockPlan));
    }

    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  useEffect(() => {
    const savedPlan = localStorage.getItem("patrolPlan");
    if (savedPlan) {
      setPatrolPlan(JSON.parse(savedPlan));
    }
  }, []);

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatrolPlan();
    setShowPatrolModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 relative"
    >
      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
        >
          <CheckCircle size={20} />
          <span>Patrol has been successfully allocated!</span>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Thoothukudi Crime Map</h1>
          <p className="mt-2 text-gray-600">
            Interactive map of crime hotspots in Thoothukudi district
          </p>
        </div>
        <button
          onClick={() => setShowPatrolModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Users size={20} /> Allocate Patrol
        </button>
      </div>

      {/* ✅ Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg h-[600px] overflow-hidden">
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
            >
              {/* Crime Hotspots */}
              {MOCK_CRIME_DATA.hotspots.map((hotspot) => (
                <Marker
                  key={hotspot.id}
                  latitude={hotspot.lat}
                  longitude={hotspot.lng}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedHotspot(hotspot);
                  }}
                >
                  <MapPin className="text-gray-500 w-7 h-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-700 transition-colors" />
                </Marker>
              ))}

              {/* Patrol Recommendations */}
              {patrolPlan.map((plan, i) => (
                <Marker key={i} latitude={plan.lat} longitude={plan.lng}>
                  <MapPin
                    className={`w-9 h-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      plan.priority === "High"
                        ? "text-red-700"
                        : plan.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                    onClick={() => setSelectedHotspot(plan)}
                  />
                </Marker>
              ))}

              {selectedHotspot && (
                <Popup
                  latitude={selectedHotspot.lat}
                  longitude={selectedHotspot.lng}
                  onClose={() => setSelectedHotspot(null)}
                  closeButton
                  closeOnClick={false}
                  anchor="bottom"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{selectedHotspot.location}</h3>
                    {selectedHotspot.incidents && (
                      <p>{selectedHotspot.incidents} incidents reported</p>
                    )}
                    {selectedHotspot.recommendedOfficers && (
                      <>
                        <p>Officers: {selectedHotspot.recommendedOfficers}</p>
                        <p>Shift: {selectedHotspot.recommendedTime}</p>
                        <p>Priority: {selectedHotspot.priority}</p>
                      </>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Thoothukudi District</p>
                  </div>
                </Popup>
              )}
            </Map>
          </div>

          {/* ✅ Patrol Allocation Summary (Below the Map) */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Patrol Allocation Summary
            </h2>
            {patrolPlan.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {patrolPlan.map((plan, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow transition"
                  >
                    <p className="font-semibold text-gray-800">{plan.location}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Officers Assigned:{" "}
                      <span className="font-medium">{plan.recommendedOfficers}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Shift: {plan.recommendedTime}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        plan.priority === "High"
                          ? "text-red-600"
                          : plan.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {plan.priority}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No patrols allocated yet. Click “Allocate Patrol” to generate one.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Hotspot Analysis</h2>
            <div className="space-y-4">
              {MOCK_CRIME_DATA.hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setViewState({
                      ...viewState,
                      latitude: hotspot.lat,
                      longitude: hotspot.lng,
                      zoom: 14,
                    });
                    setSelectedHotspot(hotspot);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{hotspot.location}</p>
                    <span className="text-red-500 font-medium">
                      {hotspot.incidents}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">AI Recommendations</h2>
            <div className="space-y-4">
              {patrolPlan.map((plan, i) => (
                <div key={i} className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">{plan.location}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Officers: {plan.recommendedOfficers}, Time: {plan.recommendedTime}, Priority:{" "}
                    {plan.priority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPatrolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Schedule Patrol Meeting
            </h2>
            <form className="space-y-4" onSubmit={handleScheduleMeeting}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Patrol Meeting Title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <select className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2">
                  {MOCK_CRIME_DATA.hotspots.map((hotspot) => (
                    <option key={hotspot.id} value={hotspot.id}>
                      {hotspot.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meeting agenda and details..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPatrolModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CrimeMap;
