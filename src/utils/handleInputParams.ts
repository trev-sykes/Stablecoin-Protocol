/**
 * Handles validation of input parameters based on the type of operation (withdraw, deposit, mint).
 * @param {string} type - The type of operation (withdraw, deposit, mint).
 * @param {any} amount - The amount being input by the user.
 * @param {Function} showAlert - Function to display an alert message to the user.
 * @param {any} [mint] - Optional parameter for minting amount validation.
 * @returns {boolean} - Returns true if the input is valid, otherwise false.
 */
export const handleInputParams = (type: string, amount: any, showAlert: Function, mint?: any) => {
    // Switch case to handle different operations based on the 'type' argument
    switch (type) {
        // Case for withdraw operation
        case 'withdraw':
            // Check if the amount is valid (greater than or equal to 1)
            if (!amount || parseFloat(amount) < 1) {
                showAlert('Please enter a valid amount (minimum 1 sBTC)', 'error'); // Show alert for invalid amount
                return false; // Return false indicating invalid input
            }
            return true; // Return true if the amount is valid

        // Case for deposit operation
        case 'deposit':
            // Check if the amount is valid (greater than or equal to 1)
            if (!amount || parseFloat(amount) < 1) {
                showAlert('Please enter a valid amount (minimum 1 sBTC)', 'error'); // Show alert for invalid amount
                return false; // Return false indicating invalid input
            }
            return true; // Return true if the amount is valid

        // Case for mint operation
        case 'mint':
            // Check if the amount is valid (greater than or equal to 1 and less than or equal to the 'mint' value)
            if (!amount || parseFloat(amount) < 1 || parseFloat(amount) > mint) {
                showAlert('Please enter a valid amount', 'error'); // Show alert for invalid amount
                return false; // Return false indicating invalid input
            }
            return true; // Return true if the amount is valid

        // Default case if the type doesn't match any of the cases
        default:
            return false; // Return false indicating invalid type or unhandled case
    }
}
