import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Text, Title, Button } from '@tremor/react';

const positions: [number, number][] = [
  [45.076779, 7.683629],
  [45.077420, 7.684019],
  [45.076504, 7.684078],
  [45.076904, 7.683068]
];

const PageMap = () => {
  const centerPosition: [number, number] = [45.076779, 7.683629];

  return (
    <div style={{ height: '93vh', width: '100vw' }}>
      <MapContainer center={centerPosition} zoom={18} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {positions.map((position, idx) => (
          <Marker key={idx} position={position}>
            <Popup>
              Marker at position {position[0]}, {position[1]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Button style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000 // Bring the button to the front
      }}>
        Placeholder for market selector
      </Button>
    </div>
  );
}

export default PageMap;
