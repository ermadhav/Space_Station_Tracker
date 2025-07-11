import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";

// Custom ISS icon
const issIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3212/3212608.png",
  iconSize: [40, 40],
});

function App() {
  const [issData, setIssData] = useState(null);
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/iss");
        setIssData(data);
      } catch (error) {
        console.error("Error fetching ISS data:", error);
      }
    };

    fetchISS();
    let interval = setInterval(fetchISS, 5000);

    return () => clearInterval(interval);
  }, [tracking]);

  const stopTracking = () => setTracking(false);

  return (
    <div className="container">
      <div className="left">
        <h1>Track the International Space Station</h1>
        <div className="info">
          <p><span>Country:</span> Not available</p>
          <p><span>State:</span> Not available</p>
          <p><span>Latitude:</span> {issData ? issData.latitude.toFixed(4) : "Loading..."}</p>
          <p><span>Longitude:</span> {issData ? issData.longitude.toFixed(4) : "Loading..."}</p>
          <p><span>Velocity:</span> {issData ? (issData.velocity.toFixed(2) + " kmph") : "Loading..."}</p>
          <p><span>Altitude:</span> {issData ? (issData.altitude.toFixed(2) + " km") : "Loading..."}</p>
        </div>
        <button className="stop-btn" onClick={stopTracking}>Stop Tracking</button>
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
