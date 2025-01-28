/* eslint-disable no-useless-catch */
const API_URL = 'http://localhost:3001/api';
import { Vendor, Product, Reward } from './models';

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
            vendorData.products.map((productData: any) => new Product(
                productData.id,
                productData.name,
                productData.price,
                productData.points
            ))
        ));
    } catch (error) {
        throw error;
    }
};

const getRewards = async () => {
    try {
        const response = await fetch(`${API_URL}/rewards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((rewardData: Reward) => new Reward(
            rewardData.id,
            rewardData.description,
            rewardData.cost,
            rewardData.icon,
        ));
    } catch (error) {
        throw error;
    }
};

const redeemReward = async (rewardID: number) => {
    try {
        const response = await fetch(`${API_URL}/rewards/redeem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rewardID }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        throw error;
    }
};

const getRedeemedRewards = async () => {
    try {
        const response = await fetch(`${API_URL}/rewards/redeemed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map((rewardData: Reward) => new Reward(
            rewardData.id,
            rewardData.description,
            rewardData.cost,
            rewardData.icon,
        ));
    } catch (error) {
        throw error;
    }
};

const API = {
    getVendorsByMarket, getRewards, getRedeemedRewards, redeemReward
};

export default API;