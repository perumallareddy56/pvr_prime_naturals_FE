import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LuWarehouse, LuMapPin, LuTruck } from 'react-icons/lu';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon Generator
const createCustomIcon = (iconComponent, color) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div style={{ color, filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}>
        {iconComponent}
      </div>
    ),
    className: 'custom-map-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const warehouseIcon = createCustomIcon(<LuWarehouse size={24} />, '#d4af37');
const userIcon = createCustomIcon(<LuMapPin size={24} />, '#00f2ff');
const truckIcon = createCustomIcon(<LuTruck size={28} />, '#39ff14');

// Recenter Component to smoothly follow the truck
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.panTo(coords, { animate: true, duration: 1 });
    }
  }, [coords, map]);
  return null;
};

const DeliveryMap = ({ orderId, status, createdAt }) => {
  // Deterministic random points based on order ID for demo consistency
  const points = useMemo(() => {
    const seed = parseInt(orderId) || 1;
    const startLat = 12.9716 + (seed % 10) * 0.01;
    const startLng = 77.5946 + (seed % 7) * 0.01;
    const endLat = startLat + 0.05 + (seed % 5) * 0.005;
    const endLng = startLng + 0.05 + (seed % 3) * 0.005;
    
    return {
      start: [startLat, startLng],
      end: [endLat, endLng],
      center: [(startLat + endLat) / 2, (startLng + endLng) / 2]
    };
  }, [orderId]);

  const [currentPos, setCurrentPos] = useState(points.start);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'DELIVERED') {
      setCurrentPos(points.end);
      setProgress(100);
      return;
    }

    if (status !== 'SHIPPED' && status !== 'OUT_FOR_DELIVERY') {
      setCurrentPos(points.start);
      setProgress(0);
      return;
    }

    // Simulation logic: Move from start to end over 2 minutes (looping for demo)
    const duration = 120000; // 2 minutes
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) % duration;
      const p = elapsed / duration;
      
      const lat = points.start[0] + (points.end[0] - points.start[0]) * p;
      const lng = points.start[1] + (points.end[1] - points.start[1]) * p;
      
      setCurrentPos([lat, lng]);
      setProgress(p * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, points]);

  return (
    <div className="delivery-map-container glass-panel" style={{ height: '350px', position: 'relative' }}>
      <MapContainer 
        center={points.center} 
        zoom={12} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Route Line */}
        <Polyline 
          positions={[points.start, points.end]} 
          color="#d4af37" 
          weight={3} 
          opacity={0.3} 
          dashArray="10, 10"
        />
        
        <Polyline 
          positions={[points.start, currentPos]} 
          color="#39ff14" 
          weight={4} 
          className="delivery-route-path"
        />

        {/* Start Point */}
        <Marker position={points.start} icon={warehouseIcon}>
          <Popup>
            <div className="text-dark">
              <strong>Gourmet Dispatch Hub</strong><br />
              Order #PVR-{orderId} Dispatched
            </div>
          </Popup>
        </Marker>

        {/* Current Position (Truck) */}
        {(status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY') && (
          <Marker position={currentPos} icon={truckIcon}>
            <RecenterMap coords={currentPos} />
            <Popup>
              <div className="text-dark">
                <strong>In Transit</strong><br />
                {Math.round(progress)}% of delivery complete
              </div>
            </Popup>
          </Marker>
        )}

        {/* End Point */}
        <Marker position={points.end} icon={userIcon}>
          <Popup>
            <div className="text-dark">
              <strong>Your Gourmet Destination</strong><br />
              Secure Delivery Protocol Active
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map Overlay Info */}
      <div className="position-absolute bottom-0 start-0 m-3 p-3 glass-panel rounded-3" style={{ zIndex: 1000, pointerEvents: 'none' }}>
        <div className="d-flex align-items-center gap-2">
          <div className={`live-dot ${status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' ? 'text-success' : 'text-muted'}`}></div>
          <span className="smallest text-white fw-bold letter-spacing-1">
            {status === 'DELIVERED' ? 'ARRESTED AT DESTINATION' : (status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' ? 'REAL-TIME TRACKING ACTIVE' : 'PENDING DISPATCH')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
