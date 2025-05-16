"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrackerLocation } from '../../../../packages/shared/types';
import { socket } from './socket'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.prototype.options.iconRetinaUrl = markerIcon2x;
L.Icon.Default.prototype.options.iconUrl = markerIcon;
L.Icon.Default.prototype.options.shadowUrl = markerShadow;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView() {
  const [trackers, setTrackers] = useState<TrackerLocation[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('request-initial-data'); 
    });

    socket.on('tracker-update', (data: TrackerLocation[]) => {
      setTrackers(data);
    });

    return () => {
      socket.off('connect');
      socket.off('tracker-update');
    };
  }, []);

  return (
    <MapContainer center={[-6.2088, 106.8456]} zoom={15} style={{ height: '100vh' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {trackers.map((tracker) => (
        <Marker key={tracker.id} position={[tracker.lat, tracker.lng]}>
          <Popup>
            <strong>{tracker.id}</strong><br />
            Last seen: {new Date(tracker.lastSeen).toLocaleTimeString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
