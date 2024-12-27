import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Text, Title, Button } from '@tremor/react';
import currentMarket from '../../currentMarket.json';
import API from '../../API';
import { Vendor } from '../../models';
import MarketSelectorSheet from '../MarketSelectorSheet/MarketSelectorSheet';

const getRandomOffset = (): [number, number] => {
  const randomValue = () => Math.random() * 0.0008 - 0.0004; // Generates a random number between -0.00002 and 0.00002
  return [randomValue(), randomValue()];
};


const PageMap = () => {
  const offset: [number, number] = getRandomOffset();
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    (currentMarket.position as [number, number])[0] + offset[0],
    (currentMarket.position as [number, number])[1] + offset[1]
  ]);
  const [marketName, setMarketName] = useState<string>(currentMarket.marketName);
  const [centerPosition, _] = useState<[number, number]>(currentMarket.position as [number, number]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const fetchedVendors = await API.getVendorsByMarket(marketName);
        setVendors(fetchedVendors);
        console.log('Fetched vendors:', fetchedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, [marketName]);

  {/*handle movable marker movement*/ }
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

  return (
    <div style={{ height: '93vh', width: '100vw', position: 'relative' }}>
      <MapContainer center={centerPosition} zoom={20} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/*<Polyline positions={positions} color="blue" />*/}
        {/*Vendors position*/}
        {vendors.map((vendor, idx) => {
          const position: [number, number] = vendor.position as [number, number];
          return (
            <Marker key={idx} position={position}>
              <Popup>
                <div onClick={() => window.location.href = `/vendor/${vendor.id}`} style={{ cursor: 'pointer' }}>
                  <strong>{vendor.name}</strong>
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
        {/*user current position*/}
        <CircleMarker center={markerPosition} radius={10} color="white" fillColor="blue" fillOpacity={1}>
          <Popup>
            This is you!
          </Popup>
        </CircleMarker>
      </MapContainer>
      {/*Market name position*/}
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
        <MarketSelectorSheet />
      </Button>
    </div>
  );
}

export default PageMap;
