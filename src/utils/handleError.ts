/**
 * Parses the error object and returns a human-readable error message.
 * @param action - The action that was attempted (e.g., 'Deposit', 'Mint', etc.).
 * @param err - The error object thrown during the action.
 * @returns A string describing the error in a user-friendly way.
 */
const parseError = (action: string, err: any): string => {
    let errorMessage = "";
    if (err.code === "ACTION_REJECTED" || err.code === 4001) {
        errorMessage = `Transaction rejected by user during ${action}.`;
    } else if (err.code === "INSUFFICIENT_FUNDS") {
        errorMessage = `Insufficient funds to complete the ${action} transaction.`;
    } else if (err.reason) {
        errorMessage = `Transaction failed during ${action}: ${err.reason}`;
    } else if (err.message.includes("revert")) {
        errorMessage = `${action} failed: Transaction reverted by the smart contract.`;
    } else {
        errorMessage = `Unexpected error during ${action}: ${err.message || "Unknown error"}`;
    }
    return errorMessage;
};

/**
 * Handles errors by logging them and showing an alert to the user.
 * @param action - The action that was attempted (e.g., 'Deposit', 'Mint', etc.).
 * @param err - The error object thrown during the action.
 * @param showAlert - A function to show alerts to the user.
 */
export const handleError = (action: string, err: any, showAlert: Function) => {
    const errorMessage: string = parseError(action, err);
    console.error(`${action} Failed: ${errorMessage}`);
    showAlert(`${action} Failed: ${errorMessage}`, 'failure');
};
