import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";

// Custom icon for ISS
const issIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3212/3212608.png",
  iconSize: [40, 40],
});

function App() {
  const [issData, setIssData] = useState(null);
  const [tracking, setTracking] = useState(true);
  const intervalRef = useRef(null);

  const fetchISS = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/iss");
      setIssData(data);
    } catch (err) {
      console.error("Error fetching ISS data", err);
    }
  };

  useEffect(() => {
    if (tracking) {
      fetchISS();
      intervalRef.current = setInterval(fetchISS, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [tracking]);

  const toggleTracking = () => {
    setTracking(prev => !prev);
  };

  return (
    <div className="container">
      <div className="left">
        <h1>Track the International Space Station</h1>
        <div className="info">
          <p><span>Country:</span> {issData?.country || "Not available"}</p>
          <p><span>State:</span> {issData?.state || "Not available"}</p>
          <p><span>Latitude:</span> {issData ? issData.latitude.toFixed(4) : "Loading..."}</p>
          <p><span>Longitude:</span> {issData ? issData.longitude.toFixed(4) : "Loading..."}</p>
          <p><span>Velocity:</span> {issData ? issData.velocity.toFixed(2) + " kmph" : "Loading..."}</p>
          <p><span>Altitude:</span> {issData ? issData.altitude.toFixed(2) + " km" : "Loading..."}</p>
        </div>

        <button className="track-btn" onClick={toggleTracking}>
  <span>{tracking ? "STOP TRACKING" : "START TRACKING"}</span>
</button>

      </div>

      <div className="right">
        {issData && (
          <MapContainer
            center={[issData.latitude, issData.longitude]}
            zoom={3}
            scrollWheelZoom={false}
            className="map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[issData.latitude, issData.longitude]} icon={issIcon}>
              <Popup>ISS is here 🚀</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default App;
