import React, { useState } from "react";
import FacilityMap from "./FacilityMap";
import axios from "axios";

// styled components
const inputStyle = {
  padding: "6px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const dropdownStyle = {
  padding: "6px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  fontSize: "14px",
};

const searchButtonStyle = {
  backgroundColor: "#000",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
};

const refreshButtonStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
};

const resultCardStyle = {
  border: "1px solid #ddd",
  padding: "8px", // Keeps padding small
  margin: "6px 0", // Keeps spacing between cards small
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
  width: "100%", // Full width
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Prevents stretching
  minHeight: "auto", // Allows height to adjust dynamically
  maxHeight: "220px", // Limits height but keeps content visible
  overflowY: "auto", // Allows scrolling if necessary
};

const requestButtonStyle = {
  backgroundColor: "#28A745",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "12px",
};

const managerCardStyle = {
  marginTop: "4px", // Reduce space between main card and manager box
  padding: "6px", // Reduce internal padding
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f8f9fa",
  boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
  width: "100%", // Ensure it takes full width
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Align text to left
};

const textStyle = {
  fontSize: "14px", // Reduce font size slightly
  lineHeight: "1.2", // Reduce spacing between lines
  margin: "2px 0", // Remove unnecessary vertical spacing
};


function App() {
  const [filters, setFilters] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showManager, setShowManager] = useState({});

  const fetchFilteredSupervisors = () => {
    const queryParams = new URLSearchParams(filters).toString();
    axios.get(`http://127.0.0.1:8000/supervisors?${queryParams}`)
      .then(response => {
        setSupervisors(response.data);
        setSelectedFacility(null);
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  const fetchFacilitySupervisors = (facilityName) => {
    setSelectedFacility(facilityName);
    axios.get(`http://127.0.0.1:8000/facility-supervisors?facility_name=${encodeURIComponent(facilityName)}`)
      .then(response => {
        setSupervisors(response.data);
      })
      .catch(error => console.error("Error fetching supervisors:", error));
  };


  return (
    <div>
      {/* Filters & Map Section */}
      <div style={{ display: "flex", gap: "20px", alignItems: "stretch", height: "auto", position: "relative" }}>
        {/* Left side - Filters */}
        <div
          style={{
            width: "50%",
            padding: "15px",
            backgroundColor: "#cfe2f3",
            borderRadius: "0px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch", // Make items stretch to fit
            justifyContent: "space-between", // Evenly distribute elements
            height: "100%", // Ensure full height
            minHeight: "438px", // Match facility map height
          }}
        >
          <div>
            <h2 style={{ textAlign: "center", marginTop: "2px", marginBottom: "2px" }}>
              Filter By Description
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {/* Filters */}
              <label><strong>Availability:</strong></label>
              <select style={dropdownStyle} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
                <option value="">Any</option>
                <option value="Available">Available</option>
                <option value="On Call">On Call</option>
                <option value="Deployed">Deployed</option>
              </select>
  
              <label><strong>Department:</strong></label>
              <select style={dropdownStyle} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                <option value="">Any</option>
                <option value="Administration">Administration</option>
                <option value="Nursing Administration">Nursing Administration</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology</option>
                <option value="Respiratory Therapy">Respiratory Therapy</option>
                <option value="Surgery">Surgery</option>
                <option value="Physical Therapy">Physical Therapy</option>
                <option value="Emergency Room">Emergency Room</option>
              </select>
  
              <label><strong>RN Experience:</strong></label>
              <select style={dropdownStyle} onChange={(e) => setFilters({ ...filters, rn_experience: e.target.value })}>
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
  
              <label><strong>Minimum Years at HCA:</strong></label>
              <input type="number" style={inputStyle} onChange={(e) => setFilters({ ...filters, min_experience: e.target.value })} />
  
              <label><strong>State:</strong></label>
              <select style={dropdownStyle} onChange={(e) => setFilters({ ...filters, state: e.target.value })}>
                <option value="">Any</option>
                <option value="AK">Alaska</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="MO">Missouri</option>
                <option value="NC">North Carolina</option>
                <option value="NH">New Hampshire</option>
                <option value="SC">South Carolina</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VA">Virginia</option>
              </select>
  
              <label><strong>City:</strong></label>
              <input type="text" style={inputStyle} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
            </div>
          </div>
  
          {/* Buttons Row */}
          <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
            <button style={searchButtonStyle} onClick={fetchFilteredSupervisors}>Search</button>
            <button style={refreshButtonStyle} onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
  
        {/* Right Side - Maps */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ padding: "10px" }}>
            <h3>Choose a Facility from the Map:</h3>
            <FacilityMap setSelectedFacility={fetchFacilitySupervisors} />
          </div>
          {/* Disaster Map Below Facility Map */}
          <div style={{ width: "100%", padding: "10px", marginTop: "5px" }}>
            <iframe src="/disaster_map.html" width="100%" height="400px" style={{ border: "none" }} title="Disaster Map"></iframe>
          </div>
        </div>
      </div>
  
      {/* Results Section Directly Below Filters */}
      <div style={{ position: "absolute", top: "480px", left: "0", width: "49%", padding: "13px", }}>
        <h3>Results:</h3>
        {selectedFacility && <h4>Showing results for: {selectedFacility}</h4>}
        {supervisors.length === 0 ? (
          <p>No results found.</p>
        ) : (
          supervisors.map((sup) => (
            <div key={sup.Emp34Id} style={resultCardStyle}>
              <h3 style={{ margin: "4px 0", fontSize: "16px" }}>
                {sup.EmpFirstName} {sup.EmpLastName}
              </h3>
              <p style={textStyle}><strong>ID:</strong> {sup.Emp34Id}</p>
              <p style={textStyle}><strong>Location:</strong> {sup.EmpLocationDesc}</p>
              <p style={textStyle}><strong>Position:</strong> {sup.EmpPositionDesc}</p>
              <p style={textStyle}><strong>Department:</strong> {sup.EmpDepartmentName}</p>
              <p style={textStyle}>
                <strong>Manager Information:</strong>{" "}
                {sup.Mgr34Id ? (
                  <button onClick={() => setShowManager((prev) => ({ ...prev, [sup.Emp34Id]: !prev[sup.Emp34Id] }))} 
                    style={{ border: "none", background: "none", cursor: "pointer", fontSize: "16px" }}>
                    ▼
                  </button>
                ) : (
                  "Not Available"
                )}
              </p>
              {showManager[sup.Emp34Id] && sup.Mgr34Id && (
                <div style={managerCardStyle}>
                  <h4 style={{ margin: "4px 0", fontSize: "15px" }}>
                    {sup.MgrName}
                  </h4>
                  <p style={textStyle}><strong>ID:</strong> {sup.Mgr34Id}</p>
                  <p style={textStyle}><strong>Title:</strong> {sup.MgrTitle}</p>
                </div>
              )}
              <p style={textStyle}><strong>Availability:</strong> {sup.Availability}</p>
              {["On Call", "Available"].includes(sup.Availability) && (
                <button style={requestButtonStyle} onClick={() => alert(`Request sent to ${sup.EmpFirstName} ${sup.EmpLastName}.`)}>Request</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );


}

export default App;




