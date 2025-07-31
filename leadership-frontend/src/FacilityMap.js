import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const facilityMarker = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FacilityMap({ setSelectedFacility }) {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/facilities")
      .then(response => setFacilities(response.data))
      .catch(error => console.error("Error fetching facilities:", error));
  }, []);

  return (
    <MapContainer 
      center={[37.8, -96]} 
      zoom={4} 
      style={{ height: "400px", width: "100%" }} 
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {facilities.map((facility, index) => (
        <Marker 
          key={index} 
          position={[facility.latitude, facility.longitude]} 
          icon={facilityMarker} 
          eventHandlers={{
            click: () => setSelectedFacility(facility.EmpLocationDesc),
          }}
        >
          <Popup>
            <strong>{facility.EmpLocationDesc}</strong> <br />
            {facility.facility_city}, {facility.facility_state} <br />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default FacilityMap;



