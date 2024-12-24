const API_URL = 'http://localhost:3001/api';
import { Vendor } from './models';

const getVendorsByMarket = async (market: string) => {
    try {
        const response = await fetch(`${API_URL}/vendors/${market}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((vendorData: Vendor) => new Vendor(
            vendorData.id,
            vendorData.name,
            vendorData.market,
            vendorData.position,
            vendorData.quality_rating,
            vendorData.price_rating,
            vendorData.cordiality_rating,
            vendorData.priceMultiplier,
            vendorData.badges,
            vendorData.products
        ));
    } catch (error) {
        throw error;
    }
};

const API = {
    getVendorsByMarket,
};

export default API;