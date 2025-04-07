import { create } from "zustand";

/**
 * State interface for the Internet Connection store
 */
interface InternetState {
    isOnline: boolean;
    checkInternetConnection: () => void;
}

/**
 * Store for managing internet connection status
 */
const useInternetConnectionStore = create<InternetState>((set) => ({
    isOnline: navigator.onLine,
    checkInternetConnection: () => set({ isOnline: navigator.onLine }),
}));

/**
 * Listens for changes in internet connection status
 * Updates the state when the user goes online or offline
 */
if (typeof window !== "undefined") {
    window.addEventListener("online", () => useInternetConnectionStore.getState().checkInternetConnection());
    window.addEventListener("offline", () => useInternetConnectionStore.getState().checkInternetConnection());
}

export default useInternetConnectionStore;
