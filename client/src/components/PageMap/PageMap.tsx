import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vendor, Market, Product } from '../../models';
import './pagemap.css';
import tinycolor from 'tinycolor2';
import PageVendorProducts from "../PageVendorProducts/PageVendorProducts.tsx";


// Helper component to update map center dynamically
const UpdateMapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

const OnFlyMarker: React.FC<{ center: [number, number], isMarketCenter: boolean }> = ({ center, isMarketCenter }) => {
    const map = useMap();

    useEffect(() => {
        let offsetLatLng = center;
        if (!isMarketCenter) {
            const offset = + 230; // Adjust this value to set the fixed point on the screen (negative value to move higher)
            const latLngPoint = map.latLngToContainerPoint(center);
            const offsetPoint = L.point(latLngPoint.x, latLngPoint.y + offset);
            const latLng = map.containerPointToLatLng(offsetPoint);
            offsetLatLng = [latLng.lat, latLng.lng];
        }

        map.flyTo(offsetLatLng, map.getZoom(), {
            animate: true,
            duration: 0.5,
        });
    }, [center, map, isMarketCenter]);

    return null;
};


interface PageMapProps {
    filteredVendors: Vendor[];
    theme: string;
    selectedMarket: Market;
    setFilteredVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
    setAddProductId: React.Dispatch<React.SetStateAction<number | null>>;
    selectedReasons: string[];
    setSelectedReasons: React.Dispatch<React.SetStateAction<string[]>>;
    setProductsWithoutAlternatives: React.Dispatch<React.SetStateAction<Product[]>>;
    productsWithoutAlternatives: Product[];
    closeAfter: () => void;
}

const PageMap: React.FC<PageMapProps> = ({
    filteredVendors,
    theme,
    selectedMarket,
    closeAfter,
    setFilteredVendors,
    setAddProductId,
    selectedReasons,
    setSelectedReasons,
    productsWithoutAlternatives,
    setProductsWithoutAlternatives,
}) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([
        selectedMarket.position[0],
        selectedMarket.position[1],
    ]);
    const [center, setMapCenter] = useState<[number, number]>(selectedMarket.position as [number, number]);
    const [selectedMarker, setSelectedMarker] = useState<[number, number] | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor>();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const vendorInFilteredVendors = selectedVendor ? filteredVendors.find(vendor => vendor.id === selectedVendor.id) : undefined;
        setSelectedVendor(vendorInFilteredVendors);
        setSelectedMarker(vendorInFilteredVendors ? vendorInFilteredVendors.position as [number, number] : null);
    }, [filteredVendors]);


    const handleMarkerClick = (position: [number, number]) => {
        setSelectedMarker(position);
        setMapCenter(position);
    };

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setSelectedMarker([e.latlng.lat, e.latlng.lng]);
                setSelectedVendor(undefined);
                setMapCenter(markerPosition);

            },
        });
        return null;
    };

    //inizialize user marker position
    useEffect(() => {
        setMarkerPosition([selectedMarket.position[0], selectedMarket.position[1]]);
    }, [selectedMarket]);


    useEffect(() => {
        if (!isOpen) {
            // Cambia il centro della mappa quando isOpen diventa false
            setMapCenter(selectedMarket.position as [number, number]);
            setSelectedMarker(selectedMarket.position as [number, number]);
        }
    }, [isOpen]);

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
        <div className='w-full h-full'>
            <MapContainer
                className='w-full h-full'
                center={center}
                zoom={17}
                maxZoom={18}
            >
                <MapClickHandler />
                <TileLayer className={theme === "dark" ? "dark-mode-filter" : ""} url={tileLayerUrl}
                    attribution={tileLayerAttribution} />
                {/* Update map center dynamically */}
                <OnFlyMarker center={center}
                    isMarketCenter={center[0] === selectedMarket.position[0] && center[1] === selectedMarket.position[1]}
                />
                <UpdateMapCenter center={selectedMarket.position as [number, number]} />
                {/* Vendors position */}
                {filteredVendors?.map((vendor, idx) => {
                    const position: [number, number] = vendor.position as [number, number];
                    const isFiltered = filteredVendors.some(filteredVendor => filteredVendor.id === vendor.id);
                    const icon = selectedMarker === position
                        ? selectedIcon
                        : (isFiltered ? filteredIcon : unselectedIcon);
                    return (
                        <Marker key={idx} position={position}
                            icon={icon}
                            eventHandlers={{
                                click: () => {
                                    handleMarkerClick(position);
                                    setSelectedVendor(vendor);
                                    if (!isOpen) {
                                        setIsOpen(true);
                                    }
                                },
                            }}>

                            <Tooltip direction="top" offset={[115, 10]} opacity={1} permanent
                                key={selectedMarker === position ? 'selected-tooltip' : isFiltered ? 'filtered-tooltip' : 'custom-tooltip'}
                                className={selectedMarker === position ? 'selected-tooltip' : isFiltered ? 'filtered-tooltip' : 'custom-tooltip'}>
                                <span>{vendor.name}</span>
                            </Tooltip>
                        </Marker>
                    );
                })}

                {/* User current position */}
                <CircleMarker center={markerPosition} radius={10} color="white" fillColor="blue" fillOpacity={1}>
                    <Popup>This is you!</Popup>
                </CircleMarker>
            </MapContainer>
            {selectedMarker && (
                selectedVendor && (
                    <PageVendorProducts
                        productsWithoutAlternatives={productsWithoutAlternatives} setProductsWithoutAlternatives={setProductsWithoutAlternatives}
                        closeAfter={closeAfter}
                        origin="map"
                        selectedReasons={selectedReasons} setSelectedReasons={setSelectedReasons}
                        isOpen={isOpen} setIsOpen={setIsOpen} vendor={selectedVendor} theme={theme} setFilteredVendors={setFilteredVendors} selectedMarket={selectedMarket} setAddProductId={setAddProductId} filteredVendors={filteredVendors} />
                )
            )}
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



