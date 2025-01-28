import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vendor, Market, Product } from '../../models';
import './pagemap.css';
import tinycolor from 'tinycolor2';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';




const getRandomOffset = (): [number, number] => {
  const randomValue = () => Math.random() * 0.0008 - 0.0004;
  return [randomValue(), randomValue()];
};

// Helper component to update map center dynamically
const UpdateMapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

// Helper component to move map on selected marker
const OnFlyMarker: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    const offset = +200; // Adjust this value to set the fixed point on the screen (negative value to move higher)
    const latLngPoint = map.latLngToContainerPoint(center);
    const offsetPoint = L.point(latLngPoint.x, latLngPoint.y + offset);
    const offsetLatLng = map.containerPointToLatLng(offsetPoint);

    map.flyTo(offsetLatLng, map.getZoom(), {
      animate: true,
      duration: 0.5,
    });
  }, [center, map]);

  return null;
};

interface PageMapProps {
  vendors: Vendor[];
  filteredVendors: Vendor[];
  theme: string;
  selectedMarket: Market;
}

const PageMap: React.FC<PageMapProps> = ({ filteredVendors, vendors, theme, selectedMarket }) => {
  const offset: [number, number] = getRandomOffset();
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    selectedMarket.position[0] + offset[0],
    selectedMarket.position[1] + offset[1],
  ]);
  const [center, setMapCenter] = useState<[number, number]>(selectedMarket.position as [number, number]);
  const [selectedMarker, setSelectedMarker] = useState<[number, number] | null>(null);
  const [showAllVendors, setShowAllVendors] = useState(false);
  const [showedVendors, setShowedVendors] = useState<Vendor[]>();

  const toggleButton = () => {
    setShowAllVendors(prevShowAllVendors => {
      const newShowAllVendors = !prevShowAllVendors;
      if (newShowAllVendors) {
        setShowedVendors(vendors);
      } else {
        setShowedVendors(filteredVendors);
      }
      return newShowAllVendors;
    });
  };

  const handleMarkerClick = (position: [number, number]) => {
    setSelectedMarker(position);
    setMapCenter(position);
  };

  //inizialize user marker position
  useEffect(() => {
    setMarkerPosition([selectedMarket.position[0] + offset[0], selectedMarket.position[1] + offset[1]]);
  }, [selectedMarket]);

  useEffect(() => {
    if (showAllVendors) {
      setShowedVendors(vendors);
    } else {
      setShowedVendors(filteredVendors)
    }
  }, [vendors, filteredVendors]);

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

  const createIcon = (color: string) => {

    const darkenColor = (color: string, amount: number) => {
      return tinycolor(color).darken(amount).toString();
    };

    let borderColor, backgroundColor, backgroundColorCircle;

    if (theme === 'dark') {
      borderColor = color === '#447FC4' ? '#000000' : darkenColor(color, 20);
      backgroundColor = color;
      backgroundColorCircle = color === '#447FC4' ? '##D3D3D3' : darkenColor(color, 20);
    } else if (color === 'green') {
      borderColor = '#ffffff';
      backgroundColor = '#008000';
      backgroundColorCircle = '#ffffff';
    } else {
      borderColor = color === '#447FC4' ? '#ffffff' : darkenColor(color, 20);
      backgroundColor = color;
      backgroundColorCircle = color === '#447FC4' ? '#ffffff' : darkenColor(color, 20);
    }

    const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    
      <path fill="${backgroundColor}" stroke="${borderColor}" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 3.06 2.22 5.63 5.13 6.48L12 22l1.87-6.52C16.78 14.63 19 12.06 19 9c0-3.87-3.13-7-7-7z"/>
  
      <circle cx="12" cy="9" r="2.5" fill="${backgroundColorCircle}" stroke-width="2"/>
    </svg>
  `;

    const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`;

    return new L.Icon({
      iconUrl,
      iconSize: [45, 45],
      iconAnchor: [22, 30],
      popupAnchor: [0, -30],
    });
  };

  const unselectedIcon = createIcon('#447FC4');
  const selectedIcon = createIcon('red');
  const filteredIcon = createIcon('#447FC4');

  // Handle map light-mode and dark-mode
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileLayerAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';


  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={selectedMarket.position as [number, number]}
        zoom={17}
        maxZoom={18}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer className={theme === "dark" ? "dark-mode-filter" : ""} url={tileLayerUrl} attribution={tileLayerAttribution} />
        {/* Update map center dynamically */}
        <OnFlyMarker center={center} />
        <UpdateMapCenter center={selectedMarket.position as [number, number]} />
        {/* Vendors position */}
        {showedVendors?.map((vendor, idx) => {
          const position: [number, number] = vendor.position as [number, number];
          const isFiltered = filteredVendors.some(filteredVendor => filteredVendor.id === vendor.id);
          const icon = selectedMarker === position
            ? selectedIcon
            : (isFiltered ? filteredIcon : unselectedIcon);
          return (
            <Marker key={idx} position={position}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(position),
              }}>
              <Tooltip direction="top" offset={[115, 10]} opacity={1} permanent
                key={selectedMarker === position ? 'selected-tooltip' : isFiltered ? 'filtered-tooltip' : 'custom-tooltip'}
                className={selectedMarker === position ? 'selected-tooltip' : isFiltered ? 'filtered-tooltip' : 'custom-tooltip'}>
                <span>{vendor.name}</span>
              </Tooltip>
              <Popup>
                <div
                  className="vendor-info"
                  style={{
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center"
                  }}
                  onClick={() => (window.location.href = `/vendor/${vendor.id}`)}
                >
                  <strong style={{ fontSize: "1rem" }}>{vendor.name}</strong>
                  <p>{vendor.categories.join(", ")}</p>
                  {vendor.badges.length > 0 && <p>{vendor.badges.join(", ")}</p>}
                </div>
                <div className="vendor-info" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  <p style={{ marginTop: "0.5rem" }}>Quality: {vendor.quality_rating}</p>
                  <p>Concenience: {vendor.convenience_rating}</p>
                  <p>Cordiality: {vendor.cordiality_rating}</p>
                </div>
                <strong style={{ fontSize: "1rem" }}>Products</strong>
                <ul>
                  {vendor.products.map((product, productIdx) => (
                    <li key={productIdx}>
                      {product.name}  {(product.price * vendor.priceMultiplier).toFixed(2)} €/kg
                    </li>
                  ))}
                </ul>

              </Popup>
            </Marker>
          );
        })}
        {/* User current position */}
        <CircleMarker center={markerPosition} radius={10} color="white" fillColor="blue" fillOpacity={1}>
          <Popup>This is you!</Popup>
        </CircleMarker>
      </MapContainer>
      {/* Market selector 

      <FormControlLabel
        style={{
          position: 'absolute',
          top: '1rem',
          right: '0rem',
          zIndex: 1000,
          color: theme === 'light' ? 'black' : 'white',
          textShadow: theme === 'light' ? '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff' : 'none',
          backgroundColor: theme === 'light' ? 'white' : '#333333',
          padding: '0rem',
          borderRadius: '0.25rem',
        }}
        onClick={toggleButton}
        control={<Switch defaultChecked />}
        label={
          <span style={{ marginRight: '1rem' }}>Shopping List Only</span> // Aggiungi margine a destra del testo
        }
      />
      */}

    </div>
  );
};

export default PageMap;



