import { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PageMap from '../PageMap/PageMap';
import { Market, Product, Vendor } from '../../models';
import PageShoppingList from '../PageShoppingList/PageShoppingList';
import MarketSelectorSheet from '../MarketSelectorSheet/MarketSelectorSheet';

interface TabsHeroProps {
    theme: string;
    vendors: Vendor[];
    filteredVendors: Vendor[];
    selectedMarket: Market;
    setSelectedMarket: (selectedMarket: Market) => void;
    missingProducts: string[];
    updateVendorsAndProducts: () => void;
    productsList: { [key: string]: string[] };
    setProductsList: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
}

export default function TabsHero({ theme, vendors, filteredVendors, selectedMarket, setSelectedMarket, missingProducts, updateVendorsAndProducts,productsList,setProductsList }: TabsHeroProps): JSX.Element {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'map';
    });

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newTab: string,
    ) => {
        if (newTab !== null) {
            setActiveTab(newTab);
            localStorage.setItem('activeTab', newTab);
        }
    };

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    return (
        <div>
            <MarketSelectorSheet selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                <ToggleButtonGroup
                    color="primary"
                    value={activeTab}
                    exclusive
                    onChange={handleChange}
                    aria-label="Tabs"
                >
                    <ToggleButton
                        value="list"
                        style={{
                            width: '12rem',
                            height: '2.2rem',
                            fontSize: '1rem',
                            backgroundColor: activeTab === 'list' ? '#527EBF' : (theme === 'dark' ? '#333' : '#f0f0f0'),
                            color: activeTab === 'list' ? 'white' : '#527EBF'
                        }}
                    >
                        List
                    </ToggleButton>
                    <ToggleButton
                        value="map"
                        style={{
                            width: '12rem',
                            height: '2.2rem',
                            fontSize: '1rem',
                            backgroundColor: activeTab === 'map' ? '#527EBF' : (theme === 'dark' ? '#333' : '#f0f0f0'),
                            color: activeTab === 'map' ? 'white' : '#527EBF'
                        }}
                    >
                        Map
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <div>
                {activeTab === 'map' && (
                    <div className="flex" style={{ width: '100%', height: '49.2rem' }}>
                        <PageMap theme={theme} vendors={vendors} filteredVendors={filteredVendors} selectedMarket={selectedMarket} />
                    </div>
                )}
                {activeTab === 'list' && <PageShoppingList productsList={productsList} setProductsList={setProductsList} theme={theme} selectedMarket={selectedMarket}  missingProducts={missingProducts} updateVendorsAndProducts={updateVendorsAndProducts} />}
            </div>
        </div>
    );
}