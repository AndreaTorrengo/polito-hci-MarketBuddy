/* eslint-disable no-useless-catch */
const API_URL = 'http://localhost:3001/api';
import { Vendor, Product } from './models.ts';

const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((productData: Product) => new Product(
                productData.id,
                productData.name,
                productData.price,
                productData.image,
                productData.points
        ));
    } catch (error) {
        throw error;
    }
};

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
            vendorData.convenience_rating,
            vendorData.cordiality_rating,
            vendorData.priceMultiplier,
            vendorData.categories,
            vendorData.badges,
            vendorData.products.map((productData: Product) => new Product(
                productData.id,
                productData.name,
                productData.price,
                productData.image,
                productData.points
            ))
        ));
    } catch (error) {
        throw error;
    }
};

const resetDB = async () => {
    try {
        const response = await fetch(`${API_URL}/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true;
    } catch (error) {
        throw error;
    }
};

const API = {
    getVendorsByMarket, getAllProducts, resetDB
};

export default API;