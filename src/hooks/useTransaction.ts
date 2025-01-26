
// Custom hook for handling transactions
export const useTransaction = () => {

    const handleTransaction = async (action: Function, amount: string, successMessage: string, showAlert: any, refreshProtocolState: Function, refreshOrConnectUserData: Function) => {

        try {
            showAlert('pending', `Processing ${successMessage}...`);
            const tx: any = await action(amount);
            await tx.wait();
            showAlert('success', `Successfully ${successMessage} ${amount} sBTC`);
            await refreshProtocolState();
            await refreshOrConnectUserData();
        } catch (err) {
            showAlert('error', `Failed to complete ${successMessage}: ${(err || 'Unknown error')}`);
        }
    };

    return { handleTransaction };
};
