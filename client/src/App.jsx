import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// Custom icon for ISS
const issIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/color/48/satellite.png",
  iconSize: [40, 40],
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function App() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [velocity, setVelocity] = useState(null);
  const [altitude, setAltitude] = useState(null);
  const [country, setCountry] = useState("Not available");
  const [state, setState] = useState("Not available");
  const [isTracking, setIsTracking] = useState(true);
  const intervalRef = useRef(null);

  // Fetch ISS position
  const fetchISSData = async () => {
    try {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      const data = await res.json();
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      setPosition({ lat, lng: lon });
      setVelocity(data.velocity.toFixed(2));
      setAltitude(data.altitude.toFixed(2));
    } catch (err) {
      console.error("Failed to fetch ISS data", err);
    }
  };

  // Reverse geocoding to get country/state
  const getLocationDetails = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = response.data;
      setCountry(data.countryName || "Not available");
      setState(data.principalSubdivision || "Not available");
    } catch (error) {
      console.error("Geocoding error:", error);
      setCountry("Not available");
      setState("Not available");
    }
  };

  // Update location and geocode it
  const updateISSData = () => {
    fetchISSData().then(() => {
      getLocationDetails(position.lat, position.lng);
    });
  };

  useEffect(() => {
    if (isTracking) {
      updateISSData();
      intervalRef.current = setInterval(updateISSData, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTracking]);

  return (
    <div className="container">
      <div className="left">
        <h1>TRACK THE INTERNATIONAL SPACE STATION</h1>
        <div className="info">
          <p><span>Country:</span> {country}</p>
          <p><span>State:</span> {state}</p>
          <p><span>Latitude:</span> {position.lat.toFixed(4)}</p>
          <p><span>Longitude:</span> {position.lng.toFixed(4)}</p>
          <p><span>Velocity:</span> {velocity} kmph</p>
          <p><span>Altitude:</span> {altitude} km</p>
        </div>
        <button
          className="track-btn"
          onClick={() => setIsTracking(!isTracking)}
        >
          {isTracking ? "STOP TRACKING" : "START TRACKING"}
        </button>
      </div>

      <div className="map">
        <MapContainer center={[position.lat, position.lng]} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={[position.lat, position.lng]} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          />
          <Marker position={[position.lat, position.lng]} icon={issIcon}>
            <Popup>
              ISS Position<br />Lat: {position.lat.toFixed(2)}, Lng: {position.lng.toFixed(2)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
