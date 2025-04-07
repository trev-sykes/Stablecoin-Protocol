import { create } from "zustand";
import { fetchBitcoinHistoricalData } from "../services/fetchBitcoinData";

/**
 * Structure for a single price data point
 */
interface PriceDataPoint {
    timestamp: number;
    price: number;
}

/**
 * State interface for the CoinGecko store
 */
interface CoinGeckoState {
    prices: PriceDataPoint[] | null;
    isLoading: boolean;
    /** Fetches historical Bitcoin price data */
    fetchPrices: () => Promise<void>;
}

/**
 * Store for Bitcoin price data from CoinGecko
 */
const useCoinGeckoStore = create<CoinGeckoState>((set) => ({
    prices: null,
    isLoading: false,
    fetchPrices: async () => {
        set({ isLoading: true });
        try {
            const prices = await fetchBitcoinHistoricalData(30);
            set({ prices });
        } catch (error) {
            console.error("Failed to fetch prices", error);
            set({ prices: null });
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useCoinGeckoStore;