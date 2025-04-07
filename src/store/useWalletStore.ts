import { create } from "zustand";
import useWeb3Store from "./useWeb3Store";

/**
 * EIP-6963 Provider Info interface
 * @see https://eips.ethereum.org/EIPS/eip-6963
 */
interface EIP6963ProviderInfo {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
}

interface EIP6963Provider {
    info: EIP6963ProviderInfo;
    provider: any;
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
    detail: EIP6963Provider;
}

/**
 * Wallet state for managing active wallet and available wallets
 */
interface WalletState {
    activeWallet: string;
    availableWallets: EIP6963Provider[];
    isDetecting: boolean;
    error: string | null;
    detectWallets: () => Promise<EIP6963Provider[]>;
    setWalletAndSigner: (walletName: string) => void;
    clearWalletAndDisconnect: () => void;
}

/**
 * Checks if EIP-6963 is supported in the current browser
 */
const isEIP6963Supported = (): boolean => {
    return typeof window !== 'undefined' &&
        typeof window.addEventListener === 'function' &&
        typeof window.dispatchEvent === 'function';
};

/**
 * Store for managing wallet detection and connection
 */
const useWalletStore = create<WalletState>((set) => ({
    activeWallet: "",
    availableWallets: [],
    isDetecting: false,
    error: null,

    detectWallets: async () => {
        set({ isDetecting: true, error: null });

        if (!isEIP6963Supported()) {
            set({
                isDetecting: false,
                error: "Browser environment doesn't support EIP-6963 wallet detection"
            });
            return Promise.resolve([]);
        }

        return new Promise<EIP6963Provider[]>((resolve) => {
            const wallets: EIP6963Provider[] = [];
            let inactivityTimer: NodeJS.Timeout | null = null;
            let maxTimeoutTimer: NodeJS.Timeout | null = null;

            const handler = (event: EIP6963AnnounceProviderEvent) => {
                wallets.push(event.detail);
                resetInactivityTimer();
            };

            const resetInactivityTimer = () => {
                if (inactivityTimer) clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                    window.removeEventListener("eip6963:announceProvider", handler as EventListener);
                    if (maxTimeoutTimer) clearTimeout(maxTimeoutTimer);
                    set({ availableWallets: wallets });
                    resolve(wallets);
                }, 250); // 250ms inactivity period
            };

            // Set max timeout of 3 seconds
            maxTimeoutTimer = setTimeout(() => {
                if (inactivityTimer) clearTimeout(inactivityTimer);
                window.removeEventListener("eip6963:announceProvider", handler as EventListener);
                set({ availableWallets: wallets, isDetecting: false });
                resolve(wallets);
            }, 3000);

            // Start wallet detection
            window.addEventListener("eip6963:announceProvider", handler as EventListener);
            window.dispatchEvent(new Event("eip6963:requestProvider"));
            resetInactivityTimer();
        });
    },

    setWalletAndSigner: async (walletName: string) => {
        set({ activeWallet: walletName });

        try {
            const { initializeSigner } = useWeb3Store.getState();
            await initializeSigner();
            set({ isDetecting: false });
        } catch (error) {
            console.error("Failed to initialize signer:", error);
        }
    },

    clearWalletAndDisconnect: () => {
        const { disconnect } = useWeb3Store.getState();
        set({ activeWallet: "" });
        disconnect();
    },
}));

export default useWalletStore;
