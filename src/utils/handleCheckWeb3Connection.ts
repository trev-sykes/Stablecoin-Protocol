import useAlertStore from "../store/useAlertStore";
import useWeb3Store from "../store/useWeb3Store";

/**
 * Handles the Web3 connection check by verifying if the contract and signer address are valid.
 * Displays an alert if either of them is missing or invalid.
 * 
 * @param {any} contract - The smart contract instance to be interacted with.
 * @param {any} signerAddress - The address of the current signer (usually the wallet address).
 * @param {Function} showAlert - A function that displays an alert message to the user.
 * 
 * @returns {boolean} - Returns true if both the contract and signer address are valid, otherwise returns false.
 */
export const handleCheckWeb3Connection = () => {
    const { showAlert } = useAlertStore.getState();
    const { writeContract, signerAddress } = useWeb3Store.getState();
    // Check if either the contract or signer address is missing or invalid
    if (!writeContract || !signerAddress) {
        // If either is invalid, show an error alert to the user
        showAlert('Web3 connection Failed', 'error');
        return false;  // Return false to indicate that the connection failed
    }
    // If both contract and signer address are valid, return true
    return true;
}
