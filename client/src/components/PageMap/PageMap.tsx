import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@tremor/react';
import currentMarket from '../../currentMarket.json';
import { Vendor } from '../../models';
import './pagemap.css';


const getRandomOffset = (): [number, number] => {
  const randomValue = () => Math.random() * 0.0008 - 0.0004;
  return [randomValue(), randomValue()];
};

interface PageMapProps {
  vendors: Vendor[];
  theme: string;
}

// Helper component to update map center dynamically
const UpdateMapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const PageMap: React.FC<PageMapProps> = ({ vendors, theme }) => {
  const offset: [number, number] = getRandomOffset();
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    currentMarket.position[0] + offset[0],
    currentMarket.position[1] + offset[1],
  ]);

  useEffect(() => {
    setMarkerPosition([currentMarket.position[0] + offset[0], currentMarket.position[1] + offset[1]]);
  }, [currentMarket]);

  // Handle movable marker movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const [lat, lng] = markerPosition;
      switch (event.key) {
        case 'ArrowUp':
          setMarkerPosition([lat + 0.0001, lng]);
          break;
        case 'ArrowDown':
          setMarkerPosition([lat - 0.0001, lng]);
          break;
        case 'ArrowLeft':
          setMarkerPosition([lat, lng - 0.0001]);
          break;
        case 'ArrowRight':
          setMarkerPosition([lat, lng + 0.0001]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markerPosition]);

  const tileLayerUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileLayerAttribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={currentMarket.position as [number, number]}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        className={theme === "dark" ? "dark-mode" : ""}
      >
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        {/* Update map center dynamically */}
        <UpdateMapCenter center={currentMarket.position as [number, number]} />
        {/* Vendors position */}
        {vendors.map((vendor, idx) => {
          const position: [number, number] = vendor.position as [number, number];
          return (
            <Marker key={idx} position={position}>
              <Popup>
                <div
                  onClick={() => (window.location.href = `/vendor/${vendor.id}`)}
                  className={theme === "dark" ? "popup-dark" : "popup-light"}
                  style={{ cursor: "pointer" }}
                >
                  <strong style={{ fontSize: "1.1rem" }}>{vendor.name}</strong>
                  <div className="vendor-info">
                    <p>{vendor.categories.join(", ")}</p>
                    {vendor.badges.length > 0 && <p>{vendor.badges.join(", ")}</p>}
                    <p>Quality: {vendor.quality_rating}</p>
                    <p>Price: {vendor.price_rating}</p>
                    <p>Cordiality: {vendor.cordiality_rating}</p>
                  </div>
                  <strong style={{ fontSize: "1.1rem" }}>Products</strong>
                  <ul>
                    {vendor.products.map((product, productIdx) => (
                      <li key={productIdx}>{product.name}</li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {/* User current position */}
        <CircleMarker center={markerPosition} radius={10} color="white" fillColor="blue" fillOpacity={1}>
          <Popup>This is you!</Popup>
        </CircleMarker>
      </MapContainer>
      {/* Market selector */}
      <Button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        {currentMarket.marketName}
      </Button>
    </div>
  );
};

export default PageMap;
