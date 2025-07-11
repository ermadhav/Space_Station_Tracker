import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3212/3212608.png",
  iconSize: [35, 35],
});

const App = () => {
  const [issData, setIssData] = useState(null);

  useEffect(() => {
    const fetchISS = async () => {
      const { data } = await axios.get("http://localhost:5000/api/iss");
      setIssData(data);
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6">🌍 ISS Tracker</h1>

      {issData ? (
        <>
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-4 w-full max-w-md text-center">
            <p><strong>Latitude:</strong> {issData.latitude.toFixed(2)}</p>
            <p><strong>Longitude:</strong> {issData.longitude.toFixed(2)}</p>
            <p><strong>Altitude:</strong> {issData.altitude.toFixed(2)} km</p>
            <p><strong>Velocity:</strong> {issData.velocity.toFixed(2)} km/h</p>
          </div>

          <MapContainer
            center={[issData.latitude, issData.longitude]}
            zoom={3}
            scrollWheelZoom={false}
            className="h-96 w-full max-w-3xl rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[issData.latitude, issData.longitude]} icon={icon}>
              <Popup>International Space Station 🚀</Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        <p>Loading ISS data...</p>
      )}
    </div>
  );
};

export default App;
