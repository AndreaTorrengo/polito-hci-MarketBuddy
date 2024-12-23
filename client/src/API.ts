const API_URL = 'http://localhost:3001/api';

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
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

const API = {
    getVendorsByMarket,
};

export default API;