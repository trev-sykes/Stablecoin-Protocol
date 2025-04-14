import { create } from "zustand";

let timeoutId: NodeJS.Timeout;

export type MessageType = "started" | "success" | "pending" | "failure" | "error" | "warning" | "unknown";

/**
 * State for managing alert visibility and content
 */
interface AlertState {
    type: MessageType | null;
    message: string | null;
    isVisible: boolean;
    showAlert: (message: string, type: MessageType) => void;
    hideAlert: () => void;
}

/**
 * Store for handling alert messages and visibility
 */
const useAlertStore = create<AlertState>((set) => ({
    type: null,
    message: null,
    isVisible: false,

    showAlert: (message, type: MessageType) => {
        if (timeoutId) clearTimeout(timeoutId);
        set({ type, message, isVisible: true });
        timeoutId = setTimeout(() => {
            set({ type: null, message: null, isVisible: false });
        }, 25000);
    },

    hideAlert: () => {
        clearTimeout(timeoutId);
        set({ type: null, message: null, isVisible: false });
    },
}));

export default useAlertStore;
