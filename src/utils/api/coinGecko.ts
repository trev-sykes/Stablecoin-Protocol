interface CoinGeckoResponse {
    prices: [number, number][];
}

export const fetchBitcoinHistoricalData = async (days: number = 30) => {
    const isOnline = (): boolean => {
        return navigator.onLine; // Access the property directly
    };
    try {
        if (!isOnline()) {
            alert('No Internet Connection Found.');
        }
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CoinGeckoResponse = await response.json();

        return data.prices.map(([timestamp, price]) => ({
            timestamp,
            price
        }));
    } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
        return [];
    }
};